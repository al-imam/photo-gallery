import {
  sendUserAndToken,
  SendUserAndToken,
  setTokenFromQuery,
} from '@/server/next/middlewares/auth'
import service from '@/service'
import { router } from '@/server/next/router'
import { NextResponse } from 'next/server'

export type PatchQuery = { token: string }
export type PatchBody = PatchQuery & { newPassword: string }
export type PatchData = SendUserAndToken
export const PATCH = router(
  setTokenFromQuery,
  async (req, ctx, next) => {
    const { newPassword, token } = await req.json<PatchBody>()
    ctx.user = await service.user.confirmPasswordReset(
      ctx.token ?? token,
      newPassword
    )
    return next()
  },
  sendUserAndToken
)

export type PostBody = { email: string }
export type PostData = { message: string }
export const POST = router(async (req) => {
  const body = await req.json<PostBody>()
  await service.user.requestPasswordReset(body.email)
  return NextResponse.json<PostData>({
    message: 'Reset password code sent to your email',
  })
})
