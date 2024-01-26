import { onlyAdmin, onlyModerator } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import service from '@/service'
import { UpdateReportBody } from '@/service/model/media'
import { MediaReport } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PatchBody = Pick<UpdateReportBody, 'status'>
export type PatchData = { report: MediaReport }
export const PATCH = authRouter(onlyModerator, async (req, ctx) => {
  const report = await service.media.updateReport(
    ctx.params.reportId!,
    ctx.user,
    { status: ctx.body<PatchBody>().status }
  )

  return NextResponse.json<PatchData>({ report })
})

export const DELETE = authRouter(onlyAdmin, async (_, ctx) => {
  await service.media.deleteReport(ctx.user, ctx.params.reportId!)
  return NextResponse.json(null)
})
