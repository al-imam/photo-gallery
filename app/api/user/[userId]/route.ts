import { optionalAuthRouter } from '@/server/next/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import { USER_PUBLIC_FIELDS } from '@/service/config'
import { pick } from '@/service/utils'
import { User } from '@prisma/client'

export type GETBody = Pick<User, (typeof USER_PUBLIC_FIELDS)[number]>
export const GET = optionalAuthRouter(async (_, ctx) => {
  const username = ctx.params.userId
  if (!username) throw new ReqErr('Missing userId')

  const user =
    ctx.user && ctx.user.id === username
      ? ctx.user
      : await service.user.fetchByUsername(username)

  return Response.json(pick(user, ...USER_PUBLIC_FIELDS))
})
