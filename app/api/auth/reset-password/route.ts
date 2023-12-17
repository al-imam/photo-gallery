import {
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import { router } from '/server/next/router'
import { NextResponse } from 'next/server'

export type PatchBody = { token: string; newPassword: string }
export type PatchData = SendUserAndToken
export const PATCH = router(async (req, ctx, next) => {
  const { token, newPassword } = (await req.json()) as PatchBody
  ctx.user = await service.user.confirmPasswordReset(token, newPassword)
  return next()
}, sendUserAndToken)

export type PostBody = { email: string }
export type PostData = { message: string }
export const POST = router(async (req) => {
  const body = (await req.json()) as PostBody
  await service.user.requestPasswordReset(body.email)
  return NextResponse.json<PostData>({
    message: 'Reset password code sent to your email',
  })
})
