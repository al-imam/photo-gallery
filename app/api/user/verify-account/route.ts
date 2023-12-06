import * as server from '/server'
import { sendUserAndToken } from '/server/middlewares/auth'
import { authRouter } from '/server/router'

export const POST = authRouter(async (req, ctx, next) => {
  const body = await req.json()
  const result = await server.user.verifyAccount(ctx.user.id, body.code)
  ctx.user = result
  return next()
}, sendUserAndToken)
