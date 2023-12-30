import { authRouter } from '@/server/next/router'
import service from '@/service'
import { USER_PUBLIC_FIELDS } from '@/service/config'
import { ChangeStatusBody } from '@/service/model/user'
import { PrettifyPick, pick } from '@/service/utils'
import { User } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PatchBody = ChangeStatusBody
export type PatchData = {
  user: PrettifyPick<User, (typeof USER_PUBLIC_FIELDS)[number]>
}

export const PATCH = authRouter(async (_, ctx, next) => {
  const userId = ctx.params.userId!
  const user = await service.user.changeStatus(ctx.user, userId, ctx.body())
  return NextResponse.json<PatchData>({
    user: pick(user, ...USER_PUBLIC_FIELDS),
  })
})
