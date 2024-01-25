import {
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/middlewares/auth'
import service from '@/service'
import { router } from '@/server/router'
import { NextResponse } from 'next/server'

export type PatchBody = { newPassword: string; token: string }
export type PatchData = SendUserAndTokenData
export const PATCH = router(async (req, ctx, next) => {
  const body = ctx.body<PatchBody>()
  ctx.user = await service.user.confirmPasswordReset(
    body.token,
    body.newPassword
  )
  return next()
}, sendUserAndToken)

export type PostBody = { email: string }
export type PostData = { message: string }
export const POST = router(async (_, ctx) => {
  const body = ctx.body<PostBody>()
  await service.user.requestPasswordReset(body.email)
  return NextResponse.json<PostData>({
    message: 'Reset password code sent to your email',
  })
})
