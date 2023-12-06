import * as service from '@/server'
import { sendUserAndToken } from '@/server/middlewares/auth'
import { router } from '@/server/router'

export const GET = router(async (req, ctx, next) => {
  const token = req.cookies.get('authorization')?.value
  const user = await service.auth.checkAuth(token, 'cookie')
  ctx.user = user
  return next()
}, sendUserAndToken)
