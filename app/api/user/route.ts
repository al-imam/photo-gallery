import { UserCreateBody, UserUpdateBody } from '@/service/model/user'
import {
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/middlewares/auth'
import { authRouter, router } from '@/server/router'
import service from '@/service'
import { Profile, ProfileLink, User } from '@prisma/client'
import config from '@/service/config'
import { NextResponse } from 'next/server'
import { pick } from '@/service/utils'

export type GetBody = {
  user: Pick<User, (typeof config.user.safeFields)[number]>
  profile: Profile & { links: ProfileLink[] }
}
export const GET = authRouter(async (_, ctx) => {
  const profile = await service.profile.getUserProfile(ctx.user.id)
  return NextResponse.json<GetBody>({
    user: pick(ctx.user, ...config.user.safeFields),
    profile: profile!,
  })
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
