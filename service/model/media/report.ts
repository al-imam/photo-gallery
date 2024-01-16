import db from '@/service/db'
import { PrettifyPick, pick } from '@/service/utils'
import { MediaReport, User } from '@prisma/client'
import ReqErr from '@/service/ReqError'
import { userPermissionFactory } from '../helpers'
import { PaginationQueries, paginationQueries } from '@/service/helpers'

export type GetReportsOptions = PaginationQueries &
  PrettifyPick<MediaReport, never, 'mediaId' | 'userId' | 'status' | 'type'>

export async function getReports(options: GetReportsOptions) {
  return db.mediaReport.findMany({
    ...paginationQueries({
      orderByKey: 'createdAt',
      orderBy: 'desc',
      ...options,
    }),

    where: {
      mediaId: options.mediaId,
      userId: options.userId,
      status: options.status,
      type: options.type,
    },
  })
}

export async function getReportForMedia(userId: string, mediaId: string) {
  return db.mediaReport.findFirstOrThrow({
    where: { mediaId, userId },
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
      ...pick(body, 'type', 'message'),
    },
  })
}

export type UpdateReportBody = Partial<
  CreateReportBody & PrettifyPick<MediaReport, 'status'>
>
export async function updateReport(
  user: PrettifyPick<User, 'id' | 'role'>,
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
    data: pick(body, 'type', 'status', 'message'),
  })
}

export async function deleteReport(
  user: PrettifyPick<User, 'id' | 'role'>,
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
