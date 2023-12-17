import {
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import { authRouter, router } from '/server/next/router'
import service from '/service'

export type GetData = SendUserAndToken
export const GET = authRouter(sendUserAndToken)

export type PostBody = { token: string; name: string; password: string }
export type PostData = SendUserAndToken
export const POST = router(async (req, ctx, next) => {
  const { token, name, password } = (await req.json()) as PostBody
  ctx.user = await service.user.create(token, {
    name,
    password,
  })

  return next()
}, sendUserAndToken)
