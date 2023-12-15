import { NextResponse } from 'next/server'
import { authRouter } from '/server/next/router'
import service from '/service'

export const POST = authRouter(async (_, ctx) => {
  const result = await service.user.resendEmailVerificationCode(ctx.user)
  ctx.user = result
  return NextResponse.json({
    message: 'Verification code sent to your email',
  })
})
