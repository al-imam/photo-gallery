import { setMedia } from '@/server/middlewares/media'
import { serviceUserRouter } from '@/server/router'
import { NextResponse } from 'next/server'
import service from '@/service'

export const DELETE = serviceUserRouter(setMedia, async (_, ctx) => {
  const media = await service.media.deleteMedia(ctx.user, ctx.media)
  return NextResponse.json({ media })
})
