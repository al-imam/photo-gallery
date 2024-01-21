import {
  DiscordMediaUploadResult,
  MediaWithReactionCountRaw,
} from '@/service/types'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { Media, Prisma, User } from '@/service/db'
import { Prettify, PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { validateAndFormatTags } from './helpers'
import { userPermissionFactory } from '../helpers'

const mediaEditableFields = [
  'title',
  'description',
  'tags',
  'status',
  'categoryId',
  'hasGraphicContent',
] as const

const mediaModerateFields = ['status', 'categoryId', 'tags'] as const

export type CreateMediaBody = Pick<
  Prisma.MediaUncheckedCreateInput,
  (typeof mediaEditableFields)[number]
>

export type ModerateMediaBody = Partial<
  Pick<Media, (typeof mediaModerateFields)[number]>
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
  body.tags = validateAndFormatTags(body.tags as string[])
  const userPermission = userPermissionFactory(user)
  if (!(userPermission.isVerified || userPermission.isModeratorLevel)) {
    delete body.status
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
  user: PrettifyPick<User, 'id' | 'role' | 'isVerified'>,
  oldMedia: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  body: UpdateMediaBody
) {
  body.tags = validateAndFormatTags(body.tags)

  const isAuthor = oldMedia.authorId === user.id
  const userPermission = userPermissionFactory(user)
  const isVerified = userPermission.isVerified
  const isModerator = userPermission.isModeratorLevel

  if (isAuthor && (isVerified || oldMedia.status === 'PENDING')) {
    return db.media.update({
      where: { id: oldMedia.id },
      data: pick(body, ...mediaEditableFields),
      include: MEDIA_INCLUDE_QUERY,
    })
  }

  if (isModerator) {
    return moderateMedia(user.id, oldMedia, body)
  }

  if (isAuthor) {
    await db.mediaUpdateRequest.create({
      data: {
        mediaId: oldMedia.id,
        title: body.title,
        description: body.description,
        tags: body.tags?.join(', '),
        categoryId: body.categoryId,
        hasGraphicContent: body.hasGraphicContent,
      },
    })

    return db.media.findUniqueOrThrow({
      where: { id: oldMedia.id },
      include: MEDIA_INCLUDE_QUERY,
    })
  }

  throw new ReqErr('You are not allowed to edit this media', 403)
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
        statusUpdatedTo: updatedMedia.status,
        userId: moderatorId,
      },
    })
  }

  return updatedMedia
}
