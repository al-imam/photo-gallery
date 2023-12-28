import { authRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'
import service from '@/service'

export const GET = authRouter(async (_, ctx) => {
  const reports = await service.media.getReports(ctx.user, ctx.params.mediaId)
  return NextResponse.json({ reports })
})
