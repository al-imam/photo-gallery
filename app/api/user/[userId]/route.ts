import { optionalAuthRouter } from '@/server/router'
import ReqErr from '@/service/ReqError'
import {
  USER_PUBLIC_FIELDS,
  USER_PUBLIC_FIELDS_QUERY,
  USER_SAFE_FIELDS,
} from '@/service/config'
import db from '@/service/db'
import { pick } from '@/service/utils'
import { Profile, ProfileLink, User } from '@prisma/client'
import { NextResponse } from 'next/server'

export type GetBody = {
  user: Pick<User, (typeof USER_PUBLIC_FIELDS)[number]>
  profile: Profile & { links: ProfileLink[] }
}
export const GET = optionalAuthRouter(async (_, ctx) => {
  const username = ctx.params.userId
  if (!username) throw new ReqErr('Missing username')

  const { profile, ...user } =
    ctx.user && (username === ctx.user.username || username === '@')
      ? {
          ...pick(ctx.user, ...USER_SAFE_FIELDS)!,
          profile: await db.profile.findUnique({
            where: { userId: ctx.user.id },
            include: { links: true },
          }),
        }
      : pick(
          await db.user.findUniqueOrThrow({
            where: { username },
            include: {
              profile: { include: { links: true } },
            },
          }),
          ...USER_PUBLIC_FIELDS,
          'profile'
        )

  return NextResponse.json<GetBody>({ user, profile: profile! })
})
