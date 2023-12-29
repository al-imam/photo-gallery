import { authRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'
import service from '@/service'
import { MediaReport } from '@prisma/client'

export type GetData = { reports: MediaReport[] }
export const GET = authRouter(async (_, ctx) => {
  const reports = await service.media.getReports(ctx.user, ctx.params.mediaId!)
  return NextResponse.json<GetData>({ reports })
})
