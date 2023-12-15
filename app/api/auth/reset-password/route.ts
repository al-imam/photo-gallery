import { router } from '/server/next/router'
import service from '/service'
import { sendUserAndToken } from '/server/next/middlewares/auth'
import { NextResponse } from 'next/server'

export const PATCH = router(async (req, ctx, next) => {
  const { token, newPassword } = await req.json()
  ctx.user = await service.user.confirmPasswordReset(token, newPassword)
  return next()
}, sendUserAndToken)


export const POST = router(async (req, _) => {
  const body = await req.json()
  await service.user.requestPasswordReset(body.email)
  return NextResponse.json({
    message: 'Reset password code sent to your email',
  })
})
