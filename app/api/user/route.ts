import {
  sendUserAndToken,
  SendUserAndToken,
  setTokenFromQuery,
} from '@/server/next/middlewares/auth'
import { authRouter, router } from '@/server/next/router'
import service from '@/service'

export type GetData = SendUserAndToken
export const GET = authRouter(sendUserAndToken)

export type PostQuery = { token: string }
export type PostBody = PostQuery & { name: string; password: string }
export type PostData = SendUserAndToken
export const POST = router(
  setTokenFromQuery,
  async (req, ctx, next) => {
    const { name, password, token } = await req.json<PostBody>()
    ctx.user = await service.user.create(ctx.token ?? token, {
      name,
      password,
    })

    return next()
  },
  sendUserAndToken
)

export type PatchBody = { name?: string }
export type PatchData = SendUserAndToken
export const PATCH = authRouter(async (req, ctx, next) => {
  const { name } = await req.json<PatchBody>()
  ctx.user = await service.user.update(ctx.token, {
    name,
  })

  return next()
}, sendUserAndToken)
