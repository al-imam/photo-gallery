import {
  UserCreateBody,
  UserUpdateBody,
  GetUserListOptions,
} from '@/service/model/user'
import {
  onlyAdmin,
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/next/middlewares/auth'
import { authRouter, router } from '@/server/next/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export type GetQuery = Partial<
  Record<keyof GetUserListOptions, string> & Pick<GetUserListOptions, 'role'>
>
export type GetData = {
  users: Awaited<ReturnType<typeof service.user.getUserList>>
}
export const GET = authRouter(onlyAdmin, async (req, ctx, next) => {
  const users = await service.user.getUserList(ctx.query<GetQuery>())
  return NextResponse.json<GetData>({ users })
})

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
