import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { Media, User } from '@/service/db'
import { PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { findOrCreateCategory, mediaPermissionFactory } from './helpers'

export type UpdateMediaBody = PrettifyPick<
  Media,
  never,
  | 'title'
  | 'description'
  | 'note'
  | 'media_hasGraphicContent'
  | 'newCategory'
  | 'tags'
  | 'categoryId'
  | 'status'
> & { moderatorNote?: string }

export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'status'>,
  oldMedia: Media,
  body: UpdateMediaBody
) {
  const permission = mediaPermissionFactory(oldMedia)

  if (!permission.edit(user)) {
    throw new ReqErr('You do not have permission to edit this media')
  }

  if (body.status && !permission.moderate(user)) {
    throw new ReqErr(
      'You do not have permission to change the status of this media'
    )
  }

  if (body.categoryId && body.newCategory) {
    throw new ReqErr('Cannot provide both categoryId and newCategory')
  }

  if (body.newCategory) {
    if (
      (permission.moderate(user) &&
        oldMedia.status === 'APPROVED' &&
        !body.status) ||
      body.status === 'APPROVED'
    ) {
      const category = await findOrCreateCategory(body.newCategory)
      body.note = null
      body.categoryId = category.id
      body.newCategory = null
    } else {
      body.categoryId = null
    }
  }

  const media = await db.media.update({
    where: { id: oldMedia.id },
    data: pick(
      body,
      'title',
      'description',
      'note',
      'tags',
      'status',
      'media_hasGraphicContent',
      'categoryId',
      'newCategory'
    ),
    include: MEDIA_INCLUDE_QUERY,
  })

  if (oldMedia.status !== media.status) {
    await db.lOG_MediaStatusChange.create({
      data: {
        mediaId: media.id,
        status_new: media.status,
        status_old: oldMedia.status,
        moderatedById: user.id,
        comment: body.moderatorNote,
      },
    })
  }

  return media
}
