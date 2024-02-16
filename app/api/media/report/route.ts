import { onlyModerator } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import service from '@/service'
import { GetReportsOptions } from '@/service/model/media'
import { MediaReport } from '@prisma/client'
import { NextResponse } from 'next/server'

export type GetData = { reports: MediaReport[] }
export type GetQuery = GetReportsOptions
export const GET = authRouter(onlyModerator, async (_, ctx) => {
  const reports = await service.media.getReports(ctx.query<GetQuery>())
  return NextResponse.json<GetData>({ reports })
})
