import { Media } from '@prisma/client'
import { PrettifyPick } from '/service/utils'
import { authRouter } from '/server/next/router'
import service from '/service'
import { NextResponse } from 'next/server'

export type PatchBody = PrettifyPick<
  Media,
  | 'title'
  | 'description'
  | 'note'
  | 'media_hasGraphicContent'
  | 'newCategory'
  | 'tags'
  | 'categoryId'
>
export type PatchData = { media: Media }
export const PATCH = authRouter(async (req, ctx) => {
  const body = await req.json<PatchBody>()
  const media = await service.media.updateMedia(ctx.user, ctx.media, body)
  return NextResponse.json<PatchData>({ media })
})
