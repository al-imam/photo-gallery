import { GetUserListOptions } from '@/service/model/user'
import { onlyAdmin } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
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
