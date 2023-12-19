import { Media } from '@prisma/client'
import { authRouter } from '@/server/next/router'
import service from '@/service'
import { NextResponse } from 'next/server'
import { UpdateMediaBody } from '@/service/model/media/types'
import { sendMediaWithLoves, setMedia } from '@/server/next/middlewares/media'
import { MediaWithLoves } from '@/service/types'

export type GetData = { media: MediaWithLoves }
export const GET = authRouter(setMedia, sendMediaWithLoves)

export type PatchBody = UpdateMediaBody
export type PatchData = { media: Media }
export const PATCH = authRouter(
  setMedia,
  async (req, ctx, next) => {
    const media = await service.media.updateMedia(
      ctx.user,
      ctx.media,
      await req.json<PatchBody>()
    )

    ctx.media = media
    return next()
  },
  sendMediaWithLoves
)

export const DELETE = authRouter(setMedia, async (_, ctx) => {
  await service.media.deleteMedia(ctx.user, ctx.media)
  return NextResponse.json(null)
})
