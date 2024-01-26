import db, { Prisma, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { mediaPermissionFactory } from './helpers'
import ReqErr from '@/service/ReqError'

export async function getUpdateRequests() {}

export async function getMediaUpdateRequest(
  requestId: string,
  user: PrettifyPick<User, 'id' | 'role'>
) {
  const media = await db.media.findUniqueOrThrow({
    where: { id: requestId },
  })

  if (!mediaPermissionFactory(media).view(user)) {
    throw new ReqErr('Permission denied to view update request')
  }

  return db.mediaUpdateRequest.findUnique({ where: { mediaId: requestId } })
}

export async function putUpdateRequest(
  mediaId: string,
  data: Omit<
    Prisma.MediaUpdateRequestUncheckedCreateInput,
    'mediaId' | 'modifiedAt'
  >
) {
  const isExisting = await db.media.findUnique({ where: { id: mediaId } })

  if (isExisting) {
    return db.mediaUpdateRequest.update({
      where: { mediaId: mediaId, modifiedAt: new Date() },
      data,
    })
  } else {
    return db.mediaUpdateRequest.create({
      data: {
        modifiedAt: new Date(),
        mediaId,
        ...data,
      },
    })
  }
}

export async function rejectUpdateRequest() {}

export async function approveUpdateRequest() {}
