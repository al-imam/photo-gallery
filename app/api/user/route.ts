import { sendUserAndToken } from '/server/next/middlewares/auth'
import { authRouter, router } from '/server/next/router'
import service from '/service'

export const GET = authRouter(sendUserAndToken)

export const POST = router(async (req, ctx, next) => {
  const { token, name, password } = await req.json()
  ctx.user = await service.user.create(token, {
    name,
    password,
  })
  return next()
}, sendUserAndToken)
