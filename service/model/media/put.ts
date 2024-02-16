import db, { Media, Prisma, User } from '@/service/db'
import { Prettify, PrettifyPick, pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { validateAndFormatTags } from './helpers'
import { userPermissionFactory } from '../helpers'
import config from '@/service/config'
import { putUpdateRequest } from './request'

export type CreateMediaApiBody = Pick<
  Prisma.MediaUncheckedCreateInput,
  (typeof config.media.editableFields)[number]
>

export type CreateMediaBody = Prettify<
  CreateMediaApiBody & {
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

  return db.media.create({
    data: {
      ...pick(body, ...config.media.editableFields),
      authorId: user.id,
      status: userPermission.isVerifiedLevel ? 'APPROVED' : 'PENDING',

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

  if (oldMedia.authorId !== user.id) {
    throw new ReqErr('Only owner can edit a media', 403)
  }

  const userPermission = userPermissionFactory(user)
  if (oldMedia.status === 'PENDING' || userPermission.isVerifiedLevel) {
    return db.media.update({
      where: { id: oldMedia.id },
      data: pick(body, ...config.media.editableFields),
      include: config.media.includePublicFields,
    })
  }

  return putUpdateRequest(
    oldMedia.id,
    pick(
      { ...body, tags: body.tags?.join(' ') },
      ...config.media.editableFields
    )
  )
}

export async function moderateMedia(
  moderatorId: string,
  oldMedia: Pick<Media, 'id' | 'status'>,
  data: ModerateMediaBody
) {
  const updatedMedia = await db.media.update({
    where: { id: oldMedia.id },
    include: config.media.includePublicFields,
    data: pick(data, ...config.media.moderateFields),
  })

  if (oldMedia.status !== updatedMedia.status) {
    await db.lOG_MediaChange.create({
      data: {
        mediaId: oldMedia.id,
        statusUpdatedTo: updatedMedia.status,
        userId: moderatorId,
      },
    })
  }

  return updatedMedia
}
