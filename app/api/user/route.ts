import {
  sendUserAndToken,
  SendUserAndToken,
  setTokenFromQuery,
} from '@/server/next/middlewares/auth'
import { authRouter, router } from '@/server/next/router'
import service from '@/service'
import { UserCreateBody } from '@/service/model/user'

export type GetData = SendUserAndToken
export const GET = authRouter(sendUserAndToken)

export type PostQuery = { token: string }
export type PostBody = PostQuery & UserCreateBody
export type PostData = SendUserAndToken
export const POST = router(
  setTokenFromQuery,
  async (req, ctx, next) => {
    const { token, ...data } = await req.json<PostBody>()
    ctx.user = await service.user.create(ctx.token ?? token, data)
    return next()
  },
  sendUserAndToken
)

export type PatchBody = { name?: string }
export type PatchData = SendUserAndToken
export const PATCH = authRouter(async (req, ctx, next) => {
  ctx.user = await service.user.update(ctx.token, await req.json<PatchBody>())
  return next()
}, sendUserAndToken)
