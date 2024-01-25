import { setMedia } from '@/server/middlewares/media'
import { authRouter } from '@/server/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export const GET = authRouter(setMedia, async (_, ctx) => {
  const messages = await service.media.getMessages(ctx.user, ctx.media)
  return NextResponse.json({ messages })
})

export type PostBody = { message: string }
export const POST = authRouter(setMedia, async (_, ctx) => {
  const message = await service.media.createMessage(
    ctx.user,
    ctx.media,
    ctx.body<PostBody>().message
  )

  return NextResponse.json({ message })
})
