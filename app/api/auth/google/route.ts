import { sendUserAndToken } from '@/server/next/middlewares/auth'
import { router } from '@/server/next/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import db from '@/service/db'
import google from '@/service/google'
import { NextResponse } from 'next/server'

export const GET = router(async (req, ctx) => {
  const { code } = ctx.query<{ code: string; state: string }>()
  if (!code) {
    throw new ReqErr('Code is missing')
  }

  const [googleUser] = await google(code)
  if (!googleUser) {
    throw new ReqErr('Failed to get user info')
  }

  let user = await db.user.findUnique({
    where: { email: googleUser.email },
  })

  if (!user) {
    user = await service.user.createCore({
      email: googleUser.email,
      name: googleUser.name,
      password: '123456',
    })
  }

  await sendUserAndToken(req, { ...ctx, user }, () => {})
  return NextResponse.redirect(req.nextUrl.clone().origin)
})
