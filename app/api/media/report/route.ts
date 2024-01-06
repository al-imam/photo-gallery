import { authRouter } from '@/server/next/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import { userPermissionFactory } from '@/service/model/helpers'
import { GetReportsOptions } from '@/service/model/media'
import { MediaReport } from '@prisma/client'
import { NextResponse } from 'next/server'

export type GetData = { reports: MediaReport[] }
export type GetQuery = GetReportsOptions
export const GET = authRouter(async (req, ctx) => {
  const permission = userPermissionFactory(ctx.user)
  if (!permission.isModeratorLevel) {
    throw new ReqErr('You are not allowed to view reports')
  }

  const reports = await service.media.getReports(ctx.query<GetQuery>())
  return NextResponse.json<GetData>({ reports })
})
