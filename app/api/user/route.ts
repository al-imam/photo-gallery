import {
  checkPassword,
  sendUserAndToken,
  SendUserAndToken,
} from '/server/next/middlewares/auth'
import { authRouter, router } from '/server/next/router'
import { NextResponse } from 'next/server'
import service from '/service'

export type GETBody = SendUserAndToken
export const GET = authRouter(sendUserAndToken)

export type POSTBody = SendUserAndToken
export const POST = router(async (req, ctx, next) => {
  const { token, name, password } = await req.json()
  ctx.user = await service.user.create(token, {
    name,
    password,
  })
  
   
  return next()
}, sendUserAndToken)

export type DELETEBody = { message: string }
export const DELETE = authRouter(checkPassword, async (_, ctx) => {
  ctx.user = await service.user.remove(ctx.user.id)
  return NextResponse.json<DELETEBody>({
    message: 'User deleted',
  })
})
