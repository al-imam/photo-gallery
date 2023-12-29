import {
  setMedia,
  sendMediaWithLoves,
  SendMediaWithLovesData,
} from '@/server/next/middlewares/media'
import { authRouter, router } from '@/server/next/router'
import service from '@/service'
import { UpdateMediaBody } from '@/service/model/media'
import { NextResponse } from 'next/server'
 
export type GetData = SendMediaWithLovesData
export const GET = router(setMedia, sendMediaWithLoves)

export type PatchBody = UpdateMediaBody
export type PatchData = SendMediaWithLovesData
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
