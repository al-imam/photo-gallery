import { setMedia } from '@/server/next/middlewares/media'
import { authRouter } from '@/server/next/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export const POST = authRouter(setMedia, async (req, ctx, next) => {
  const report = await service.media.createReport(
    ctx.user.id,
    ctx.media.id,
    await req.json()
  )

  return NextResponse.json({ report })
})
