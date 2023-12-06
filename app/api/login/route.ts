import * as server from '/server'
import { sendUserAndToken } from '/server/middlewares/auth'
import { router } from '/server/router'

export const POST = router(async (req, ctx, next) => {
  const body = await req.json()
  const result = await server.auth.login(body.email, body.password)
  ctx.user = result
  return next()
}, sendUserAndToken)
