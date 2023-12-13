import { sendUserAndToken } from '/server/next/middlewares/auth'
import { authRouter, router } from '/server/next/router'
import service from '/service'

export const POST = router(async (req, ctx, next) => {
  const body = await req.json()
  const result = await service.user.create(body)
  ctx.user = result
  return next()
}, sendUserAndToken)

export const GET = authRouter(sendUserAndToken)
