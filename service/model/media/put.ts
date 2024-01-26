import db, { ContentStatus, Media, Prisma, User } from '@/service/db'
import { Prettify, PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { validateAndFormatTags } from './helpers'
import { userPermissionFactory } from '../helpers'
import config from '@/service/config'
import { putUpdateRequest } from './request'

export type CreateMediaBody = Prettify<
  Pick<
    Prisma.MediaUncheckedCreateInput,
    (typeof config.media.editableFields)[number]
  > & {
    status?: ContentStatus
    storageRecordId: string
    media_size: number
    media_width: number
    media_height: number
    url_media: string
    url_thumbnail: string
  }
>

export type ModerateMediaBody = Partial<
  Pick<Media, (typeof config.media.moderateFields)[number]>
>

export type UpdateMediaBody = Partial<
  Prettify<
    Pick<Media, (typeof config.media.editableFields)[number]> &
      ModerateMediaBody
  >
>

export async function createMedia(
  user: Pick<User, 'id' | 'role'>,
  body: CreateMediaBody
) {
  body.tags = validateAndFormatTags(body.tags as string[])
  const userPermission = userPermissionFactory(user)
  if (!userPermission.isVerifiedLevel) {
    delete body.status
  }

  return db.media.create({
    data: {
      ...pick(body, ...config.media.editableFields),

      authorId: user.id,
      storageRecordId: body.storageRecordId,
      media_size: body.media_size,
      media_width: body.media_width,
      media_height: body.media_height,
      url_media: body.url_media,
      url_thumbnail: body.url_thumbnail,
    },

    include: config.media.includePublicFields,
  })
}

export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'role'>,
  oldMedia: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  body: UpdateMediaBody
) {
  body.tags = validateAndFormatTags(body.tags)

  const isAuthor = oldMedia.authorId === user.id

  if (isAuthor) {
    if (
      oldMedia.status === 'PENDING' ||
      userPermissionFactory(user).isVerified
    ) {
      return db.media.update({
        where: { id: oldMedia.id },
        data: pick(body, ...config.media.editableFields),
        include: config.media.includePublicFields,
      })
    }

    await putUpdateRequest(oldMedia.id, {
      title: body.title,
      description: body.description,
      tags: body.tags?.join(', '),
      categoryId: body.categoryId,
      hasGraphicContent: body.hasGraphicContent,
    })

    return db.media.findUniqueOrThrow({
      where: { id: oldMedia.id },
      include: config.media.includePublicFields,
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
    include: config.media.includePublicFields,
    data: {
      ...(extraData && pick(extraData, ...config.media.editableFields)),
      ...pick(data, ...config.media.moderateFields),
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
