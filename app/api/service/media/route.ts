import { serviceUserRouter } from '@/server/router'
import { CreateMediaBody } from '@/service/model/media'
import { NextResponse } from 'next/server'
import service from '@/service'
import { addLovesToMedia } from '@/service/model/media/helpers'

export type PostBody = CreateMediaBody
export const POST = serviceUserRouter(async (_, ctx) => {
  const media = await service.media.createMedia(ctx.user, ctx.body<PostBody>())
  return NextResponse.json({ media: await addLovesToMedia(media) })
})
