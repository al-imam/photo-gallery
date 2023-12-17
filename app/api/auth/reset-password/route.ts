import {
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import { router } from '/server/next/router'
import { NextResponse } from 'next/server'

export type PATCH = SendUserAndToken
export const PATCH = router(async (req, ctx, next) => {
  const { token, newPassword } = await req.json()
  ctx.user = await service.user.confirmPasswordReset(token, newPassword)
  return next()
}, sendUserAndToken)

export type POST = { message: string }
export const POST = router(async (req, _) => {
  const body = await req.json()
  await service.user.requestPasswordReset(body.email)
  return NextResponse.json<POST>({
    message: 'Reset password code sent to your email',
  })
})
