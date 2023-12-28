import { authRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'
import service from '@/service'
import { CreateReportBody } from '@/service/model/media'

export const GET = authRouter(async (_, ctx) => {
  const report = await service.media.getReportForMedia(
    ctx.user.id,
    ctx.params.mediaId
  )

  return NextResponse.json({ report })
})

export type POSTBody = CreateReportBody
export const POST = authRouter(async (req, ctx) => {
  const report = await service.media.createReport(
    ctx.user.id,
    ctx.params.mediaId,
    await req.json()
  )

  return NextResponse.json({ report })
})
