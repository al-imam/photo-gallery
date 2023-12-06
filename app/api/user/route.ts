import * as server from '/server'
import { sendUserAndToken } from '/server/middlewares/auth'
import { authRouter, router } from '/server/router'

export const POST = router(async (req, ctx, next) => {
  const body = await req.json()
  const result = await server.user.create(body)
  ctx.user = result
  return next()
}, sendUserAndToken)

export const GET = authRouter(sendUserAndToken)
