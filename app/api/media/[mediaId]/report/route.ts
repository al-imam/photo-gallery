import { authRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'
import service from '@/service'
import { CreateReportBody } from '@/service/model/media'
import { MediaReport } from '@prisma/client'

export type GetData = { report: MediaReport }
export const GET = authRouter(async (_, ctx) => {
  const report = await service.media.getReportForMedia(
    ctx.user.id,
    ctx.params.mediaId
  )

  return NextResponse.json<GetData>({ report })
})

export type PostBody = CreateReportBody
export type PostData = { report: MediaReport }
export const POST = authRouter(async (req, ctx) => {
  const report = await service.media.createReport(
    ctx.user.id,
    ctx.params.mediaId,
    await req.json()
  )

  return NextResponse.json<PostData>({ report })
})
