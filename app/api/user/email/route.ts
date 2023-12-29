import {
  checkPassword,
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/next/middlewares/auth'
import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/next/router'

export type PatchBody = { password: string; token: string }
export type PatchData = SendUserAndTokenData
export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    const body = ctx.body<PatchBody>()
    ctx.user = await service.user.confirmEmailChange(body.token)
    return next()
  },
  sendUserAndToken
)

export type PostBody = { newEmail: string }
export type PostData = { message: string }
export const POST = authRouter(async (req, ctx) => {
  const { newEmail } = await req.json<PostBody>()
  await service.user.requestEmailChange(ctx.user, newEmail)
  return NextResponse.json<PostData>({
    message: 'Check your email',
  })
})
