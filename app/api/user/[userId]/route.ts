import { optionalAuthRouter } from '@/server/next/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import { USER_PUBLIC_FIELDS } from '@/service/config'
import db from '@/service/db'
import { pick } from '@/service/utils'
import { Profile, User } from '@prisma/client'
import { NextResponse } from 'next/server'

export type GetBody = {
  user: Pick<User, (typeof USER_PUBLIC_FIELDS)[number]>
  profile: Profile
}

export const GET = optionalAuthRouter(async (_, ctx) => {
  const username = ctx.params.userId
  if (!username) throw new ReqErr('Missing username')

  const user =
    ctx.user && ctx.user.username === username
      ? {
          ...ctx.user,
          profile: await db.profile.findUnique({ where: { id: ctx.user.id } }),
        }
      : await service.user.fetchByUsername(username, true)

  return NextResponse.json<GetBody>({
    user: { ...pick(user, ...USER_PUBLIC_FIELDS) },
    profile: user.profile!,
  })
})
