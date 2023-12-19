import {
  checkPassword,
  sendUserAndToken,
  SendUserAndToken,
  setTokenFromQuery,
} from '@/server/next/middlewares/auth'
import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/next/router'

export type PatchQuery = { token: string }
export type PatchBody = PatchQuery & { password: string }
export type PatchData = SendUserAndToken
export const PATCH = authRouter(
  checkPassword,
  setTokenFromQuery,
  async (_, ctx, next) => {
    ctx.user = await service.user.confirmEmailChange(
      ctx.token ?? ctx.data.token
    )
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
