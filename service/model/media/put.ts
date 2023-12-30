import {
  MediaWithLoves,
  MediaPopulated,
  DiscordMediaUploadResult,
} from '@/service/types'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { Media, User } from '@/service/db'
import { PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { findOrCreateCategory, mediaPermissionFactory } from './helpers'
import { userPermissionFactory } from '../helpers'

const mediaEditableFields = [
  'title',
  'description',
  'note',
  'tags',
  'status',
  'newCategory',
  'categoryId',
  'media_hasGraphicContent',
] as const

export type CreateMediaBody = PrettifyPick<
  Media,
  'title',
  (typeof mediaEditableFields)[number]
>
export type UpdateMediaBody = Partial<
  CreateMediaBody & { moderatorComment: string }
>

export async function createMedia(
  user: Pick<User, 'id' | 'role'>,
  body: CreateMediaBody,
  uploadToDiscord: () => Promise<DiscordMediaUploadResult>,
  onFailure: (result: DiscordMediaUploadResult) => Promise<any>
) {
  if (body.newCategory && body.categoryId) {
    throw new ReqErr('Cannot provide both newCategory and categoryId')
  }

  if (body.tags && body.tags.length > 10) {
    throw new ReqErr('Cannot provide more than 5 tags')
  }

  const hasPermissionToApprove = userPermissionFactory(user).isVerifiedLevel

  if (hasPermissionToApprove) {
    body.status ??= 'APPROVED'
  } else {
    body.status = undefined
  }

  if (body.status === 'APPROVED') {
    if (body.newCategory) {
      const category = await findOrCreateCategory(body.newCategory)
      body.categoryId = category.id
    }

    body.note = null
    body.newCategory = null
  }

  const discord = await uploadToDiscord()
  let media: MediaPopulated
  try {
    media = await db.media.create({
      data: {
        ...pick(body, ...mediaEditableFields),

        authorId: user.id,
        messageId: discord.id,

        media_size: discord.media.size,
        media_width: discord.media.width,
        media_height: discord.media.height,

        url_media: discord.media.url,
        url_thumbnail: discord.thumbnail.url,
      },
      include: MEDIA_INCLUDE_QUERY,
    })
  } catch (err) {
    await onFailure(discord)
    throw err
  }

  return {
    ...media,
    isLoved: false,
    loves: 0,
    messageId: undefined as never,
  } as MediaWithLoves
}

export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'role'>,
  oldMedia: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  body: UpdateMediaBody
) {
  if (body.categoryId && body.newCategory) {
    throw new ReqErr('Cannot provide both categoryId and newCategory')
  }

  if (body.tags && body.tags.length > 10) {
    throw new ReqErr('Cannot provide more than 5 tags')
  }

  const permission = mediaPermissionFactory(oldMedia)

  if (!permission.edit(user)) {
    throw new ReqErr('You do not have permission to edit this media')
  }

  if (body.status && !permission.moderate(user)) {
    throw new ReqErr(
      'You do not have permission to change the status of this media'
    )
  }

  if (body.newCategory) {
    if (
      permission.moderate(user) &&
      oldMedia.status === 'APPROVED' &&
      (!body.status || body.status === 'APPROVED')
    ) {
      const category = await findOrCreateCategory(body.newCategory)
      body.note = null
      body.newCategory = null
      body.categoryId = category.id
    } else {
      body.categoryId = null
    }
  }

  const media = await db.media.update({
    where: { id: oldMedia.id },
    data: pick(body, ...mediaEditableFields),
    include: MEDIA_INCLUDE_QUERY,
  })

  if (oldMedia.status !== media.status) {
    await db.lOG_MediaStatusChange.create({
      data: {
        mediaId: media.id,
        status_new: media.status,
        status_old: oldMedia.status,
        moderatedById: user.id,
        comment: body.moderatorComment,
      },
    })
  }

  return media
}
