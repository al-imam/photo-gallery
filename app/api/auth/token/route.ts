import {
  SendUserAndToken,
  sendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import { cookies } from 'next/headers'
import { router } from '/server/next/router'

export type GETBody = SendUserAndToken
export const GET = router(async (req, ctx, next) => {
  const token =
    req.cookies.get('authorization')?.value ??
    cookies().get('authorization')?.value

  const user = await service.auth.checkAuth(token, 'cookie')
  ctx.user = user
  return next()
}, sendUserAndToken)
