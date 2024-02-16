import db, { Prisma, User } from '@/service/db'
import { Prettify, PrettifyPick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { userPermissionFactory } from '../helpers'
import config from '@/service/config'

export async function putUpdateRequest(
  mediaId: string,
  data: Prettify<
    Omit<
      Prisma.MediaUpdateRequestUncheckedCreateInput,
      'mediaId' | 'modifiedAt'
    >
  >
) {
  const isExisting = await db.mediaUpdateRequest.findUnique({
    where: { mediaId },
  })

  if (isExisting) {
    return db.mediaUpdateRequest.update({
      where: { mediaId },
      data: {
        modifiedAt: new Date(),
        ...data,
      },
    })
  }

  return db.mediaUpdateRequest.create({
    data: {
      mediaId,
      modifiedAt: new Date(),
      ...data,
    },
  })
}

export async function getUpdateRequests() {
  return db.mediaUpdateRequest.findMany({
    include: {
      media: { select: config.media.selectPublicFields },
    },
  })
}

export async function getMediaUpdateRequest(
  requestId: string,
  user: PrettifyPick<User, 'id' | 'role'>
) {
  const media = await db.media.findUniqueOrThrow({
    where: { id: requestId },
  })

  if (
    media.authorId !== user.id &&
    !userPermissionFactory(user).isModeratorLevel
  ) {
    throw new ReqErr('Permission denied to view update request')
  }

  return db.mediaUpdateRequest.findUnique({
    where: { mediaId: requestId },
    include: {
      media: { select: config.media.selectPublicFields },
    },
  })
}

export async function rejectUpdateRequest(mediaId: string, userId: string) {
  return db.mediaUpdateRequest.update({
    where: { mediaId },
    data: { resolvedById: userId, status: 'REJECTED' },
  })
}

export async function approveUpdateRequest(mediaId: string, userId: string) {
  const request = await db.mediaUpdateRequest.findUniqueOrThrow({
    where: { mediaId },
  })

  await db.media.update({
    where: { id: mediaId },
    data: {
      title: request.title || undefined,
      description: request.description || undefined,
      categoryId: request.categoryId || undefined,
      hasGraphicContent: request.hasGraphicContent || undefined,
      tags: request.tags ? request.tags.split(' ') : undefined,
      modifiedAt: new Date(),
    },
  })

  return db.mediaUpdateRequest.update({
    where: { mediaId },
    data: { resolvedById: userId, status: 'APPROVED' },
  })
}
