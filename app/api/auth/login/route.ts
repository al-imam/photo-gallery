import {
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import { router } from '/server/next/router'
import service from '/service'

export type POST = SendUserAndToken
export const POST = router(async (req, ctx, next) => {
  const body = await req.json()
  const result = await service.auth.login(body.email, body.password)
  ctx.user = result
  return next()
}, sendUserAndToken)
