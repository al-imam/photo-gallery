import { cookies } from 'next/headers'
import { sendUserAndToken } from '/server/next/middlewares/auth'
import { router } from '/server/next/router'
import service from '/service'

export const GET = router(async (req, ctx, next) => {
  const token =
    req.cookies.get('authorization')?.value ??
    cookies().get('authorization')?.value

  const user = await service.auth.checkAuth(token, 'cookie')
  ctx.user = user
  return next()
}, sendUserAndToken)
