import {
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/next/middlewares/auth'
import { authRouter, router } from '@/server/next/router'
import service from '@/service'
import { UserCreateBody, UserUpdateBody } from '@/service/model/user'

export type GetData = SendUserAndTokenData
export const GET = authRouter(sendUserAndToken)

export type PostBody = UserCreateBody & { token: string }
export type PostData = SendUserAndTokenData
export const POST = router(async (_, ctx, next) => {
  const body = ctx.body<PostBody>()
  ctx.user = await service.user.create(body.token, body)
  return next()
}, sendUserAndToken)

export type PatchBody = UserUpdateBody
export type PatchData = SendUserAndTokenData
export const PATCH = authRouter(async (req, ctx, next) => {
  ctx.user = await service.user.update(ctx.user.id, ctx.body<PatchBody>())
  return next()
}, sendUserAndToken)
