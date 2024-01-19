import {
  DiscordMediaUploadResult,
  MediaWithReactionCountRaw,
} from '@/service/types'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { Media, User } from '@/service/db'
import { Prettify, PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { validateAndFormatTags, mediaPermissionFactory } from './helpers'
import { userPermissionFactory } from '../helpers'
import { findOrCreateCategory } from '../category'

const mediaEditableFields = [
  'title',
  'description',
  'tags',
  'status',
  'newCategory',
  'categoryId',
  'media_hasGraphicContent',
] as const

const mediaModerateFields = [
  'status',
  'newCategory',
  'categoryId',
  'tags',
] as const

export type CreateMediaBody = PrettifyPick<
  Media,
  'title',
  (typeof mediaEditableFields)[number]
>

export type ModerateMediaBody = Partial<
  Pick<Media, (typeof mediaModerateFields)[number]> & {
    moderatorComment: string
  }
>

export type UpdateMediaBody = Prettify<
  Partial<CreateMediaBody> & ModerateMediaBody
>

export async function createMedia(
  user: Pick<User, 'id' | 'role'>,
  body: CreateMediaBody,
  uploadToDiscord: () => Promise<DiscordMediaUploadResult>,
  onFailure: (result: DiscordMediaUploadResult) => Promise<any>
) {
  body.tags = validateAndFormatTags(body.tags)
  if (userPermissionFactory(user).isVerifiedLevel) {
    body.status ??= 'APPROVED'
  } else {
    body.status = undefined
  }

  const discord = await uploadToDiscord()
  let media: MediaWithReactionCountRaw
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

  return media
}

export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'role'>,
  oldMedia: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  body: UpdateMediaBody
) {
  body.tags = validateAndFormatTags(body.tags)
  if (oldMedia.status === 'APPROVED' && (body.categoryId || body.newCategory)) {
    throw new ReqErr('Cannot edit category of approved media')
  }

  const isAuthor = oldMedia.authorId === user.id
  const isModerator = userPermissionFactory(user).isModeratorLevel

  if (isAuthor && isModerator) {
    // TODO: check if moderator is changing status
    return moderateMedia(user.id, oldMedia, body, body)
  }

  if (isModerator) {
    return moderateMedia(user.id, oldMedia, body)
  }

  if (isAuthor) {
    return db.media.update({
      where: { id: oldMedia.id },
      data: pick(body, ...mediaEditableFields),
      include: MEDIA_INCLUDE_QUERY,
    })
  }

  throw new ReqErr('You do not have permission to update this media')
}

export async function moderateMedia(
  moderatorId: string,
  oldMedia: Pick<Media, 'id' | 'authorId' | 'status'>,
  data: ModerateMediaBody,
  extraData?: UpdateMediaBody
) {
  const updatedMedia = await db.media.update({
    where: { id: oldMedia.id },
    include: MEDIA_INCLUDE_QUERY,
    data: {
      ...(extraData && pick(extraData, ...mediaEditableFields)),
      ...pick(data, ...mediaModerateFields),
    },
  })

  if (oldMedia.status !== updatedMedia.status) {
    await db.lOG_MediaStatusChange.create({
      data: {
        mediaId: oldMedia.id,
        status_old: oldMedia.status,
        status_new: updatedMedia.status,
        moderatedById: moderatorId,
        comment: data.moderatorComment,
      },
    })
  }

  return updatedMedia
}
