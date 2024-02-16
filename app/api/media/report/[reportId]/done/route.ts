import { onlyModerator } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import service from '@/service'
import { MediaReport } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PostData = { report: MediaReport }
export const POST = authRouter(onlyModerator, async (req, ctx) => {
  const report = await service.media.doneReport(
    ctx.params.reportId!,
    ctx.user.id
  )

  return NextResponse.json<PostData>({ report })
})
