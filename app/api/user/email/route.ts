import { NextResponse } from 'next/server'
import { checkPassword, sendUserAndToken } from '/server/next/middlewares/auth'
import { authRouter } from '/server/next/router'
import service from '/service'

export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    ctx.user = await service.user.confirmEmailChange(ctx.data.token)
    return next()
  },
  sendUserAndToken
)

export const POST = authRouter(async (req, ctx) => {
  const { newEmail } = await req.json()
  await service.user.requestEmailChange(ctx.user, newEmail)
  return NextResponse.json({
    message: 'Check your email',
  })
})
