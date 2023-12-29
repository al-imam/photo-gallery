import {
  sendUserAndToken,
  SendUserAndTokenData,
} from '@/server/next/middlewares/auth'
import { router } from '@/server/next/router'
import service from '@/service'

export type PostBody = { email: string; password: string }
export type PostData = SendUserAndTokenData
export const POST = router(async (_, ctx, next) => {
  const body = ctx.body<PostBody>()
  const result = await service.auth.login(body.email, body.password)
  ctx.user = result
  return next()
}, sendUserAndToken)
