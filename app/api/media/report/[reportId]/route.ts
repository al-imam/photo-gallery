import { authRouter } from '@/server/next/router'
import service from '@/service'
import { UpdateReportBody } from '@/service/model/media'
import { NextResponse } from 'next/server'

export type PATCHBody = UpdateReportBody
export const PATCH = authRouter(async (req, ctx) => {
  const report = await service.media.updateReport(
    ctx.user,
    ctx.params.reportId,
    await req.json()
  )

  return NextResponse.json({ report })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.media.deleteReport(ctx.user, ctx.params.reportId)
  return NextResponse.json(null)
})
