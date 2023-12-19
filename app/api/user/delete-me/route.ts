import { checkPassword } from '@/server/next/middlewares/auth'
import { authRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'
import service from '@/service'

export type PostBody = { password: string }
export const POST = authRouter(checkPassword, async (_, ctx) => {
  ctx.user = await service.user.remove(ctx.user.id)
  return NextResponse.json(null)
})
