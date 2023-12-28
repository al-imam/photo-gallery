import db from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { MediaReport, User } from '@prisma/client'
import ReqErr from '@/service/ReqError'
import { userPermissionFactory } from '../helpers'

export async function getReportForMedia(userId: string, mediaId: string) {
  return db.mediaReport.findFirstOrThrow({
    where: { mediaId, userId },
  })
}

export async function getReports(
  user: PrettifyPick<User, 'id' | 'status'>,
  mediaId: string
) {
  const permission = userPermissionFactory(user)
  if (!permission.isModeratorLevel) {
    throw new ReqErr('You are not allowed to view reports')
  }

  return db.mediaReport.findMany({
    where: {
      mediaId,
    },
  })
}

export type CreateReportBody = PrettifyPick<MediaReport, 'type' | 'message'>
export async function createReport(
  userId: string,
  mediaId: string,
  body: CreateReportBody
) {
  return db.mediaReport.create({
    data: {
      userId,
      mediaId,
      type: body.type,
      message: body.message,
    },
  })
}

export type UpdateReportBody = Partial<
  CreateReportBody & PrettifyPick<MediaReport, 'status'>
>
export async function updateReport(
  user: PrettifyPick<User, 'id' | 'status'>,
  reportId: string,
  body: UpdateReportBody
) {
  if (!userPermissionFactory(user).isModeratorLevel) {
    delete body.status
  }

  return db.mediaReport.update({
    where: {
      id: reportId,
      userId: typeof user === 'string' ? user : user.id,
    },
    data: {
      type: body.type,
      status: body.status,
      message: body.message,
    },
  })
}

export async function deleteReport(
  user: PrettifyPick<User, 'id' | 'status'>,
  reportId: string
) {
  const result = await db.mediaReport.delete({
    where: {
      id: reportId,
      userId: userPermissionFactory(user).isAdmin ? undefined : user.id,
    },
  })

  if (result === null) {
    throw new ReqErr('Report not found')
  }

  return result
}
