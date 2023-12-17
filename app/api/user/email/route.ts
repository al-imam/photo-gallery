import {
  checkPassword,
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import { NextResponse } from 'next/server'
import { authRouter } from '/server/next/router'

export type PATCH = SendUserAndToken
export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    ctx.user = await service.user.confirmEmailChange(ctx.data.token)
    return next()
  },
  sendUserAndToken
)

export type POST = { message: string }
export const POST = authRouter(async (req, ctx) => {
  const { newEmail } = await req.json()
  await service.user.requestEmailChange(ctx.user, newEmail)
  return NextResponse.json<POST>({
    message: 'Check your email',
  })
})
