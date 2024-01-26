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

export type CreateMediaBody = Prettify<
  Pick<
    Prisma.MediaUncheckedCreateInput,
    (typeof mediaEditableFields)[number]
  > & {
    storageRecordId: string
    media_size: number
    media_width: number
    media_height: number
    url_media: string
    url_thumbnail: string
  }
>

export type ModerateMediaBody = Partial<
  Pick<Media, (typeof mediaModerateFields)[number]>
>

export type UpdateMediaBody = Partial<
  Prettify<
    Pick<Media, (typeof mediaEditableFields)[number]> & ModerateMediaBody
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
      ...pick(body, ...mediaEditableFields),

      authorId: user.id,
      storageRecordId: body.storageRecordId,
      media_size: body.media_size,
      media_width: body.media_width,
      media_height: body.media_height,
      url_media: body.url_media,
      url_thumbnail: body.url_thumbnail,
    },

    include: MEDIA_INCLUDE_QUERY,
  })
}

export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'role'>,
  oldMedia: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  body: UpdateMediaBody
) {
  body.tags = validateAndFormatTags(body.tags)

  const isAuthor = oldMedia.authorId === user.id
  const userPermission = userPermissionFactory(user)

  if (isAuthor) {
    if (oldMedia.status === 'PENDING' || userPermission.isVerifiedLevel) {
      return db.media.update({
        where: { id: oldMedia.id },
        data: pick(body, ...mediaEditableFields),
        include: MEDIA_INCLUDE_QUERY,
      })
    }

    const data = {
      mediaId: oldMedia.id,
      title: body.title,
      description: body.description,
      tags: body.tags?.join(', '),
      categoryId: body.categoryId,
      hasGraphicContent: body.hasGraphicContent,
    }

    if (
      await db.mediaUpdateRequest.findUnique({
        where: { mediaId: oldMedia.id },
        select: { mediaId: true },
      })
    ) {
      await db.mediaUpdateRequest.update({
        where: { mediaId: oldMedia.id },
        data,
      })
    } else {
      await db.mediaUpdateRequest.create({ data })
    }

    return db.media.findUniqueOrThrow({
      where: { id: oldMedia.id },
      include: MEDIA_INCLUDE_QUERY,
    })
  }

  if (userPermission.isModeratorLevel) {
    return moderateMedia(user.id, oldMedia, body)
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
