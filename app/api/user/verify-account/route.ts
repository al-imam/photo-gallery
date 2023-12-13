import { sendUserAndToken } from '/server/next/middlewares/auth'
import { authRouter } from '/server/next/router'
import service from '/service'

export const POST = authRouter(async (req, ctx, next) => {
  const body = await req.json()
  const result = await service.user.verifyAccount(ctx.user.id, body.code)
  ctx.user = result
  return next()
}, sendUserAndToken)
