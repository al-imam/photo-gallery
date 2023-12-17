import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { USER_SAFE_FIELDS } from '/service/config'
import * as hash from '/service/hash'
import { NextUserHandler } from '/service/types'
import { pick } from '/service/utils'
import ReqErr from '/service/ReqError'
import { User } from '@prisma/client'
import db from '/service/db'

export type SendUserAndToken = {
  user: Pick<User, (typeof USER_SAFE_FIELDS)[number]> & {}

  jwt_token: string
}

export const sendUserAndToken: NextUserHandler = async (_, ctx) => {
  const cookieToken = await hash.jwt.sign('cookie', ctx.user.id)
  const authToken = await hash.jwt.sign('auth', ctx.user.id)

  cookies().set({
    name: 'authorization',
    value: cookieToken,
    path: '/',
    httpOnly: true,
    maxAge: Date.now() + 86400000 * 30,
  })

  return NextResponse.json<SendUserAndToken>({
    ...ctx.response,
    user: {
      ...pick(ctx.user, ...USER_SAFE_FIELDS),
    },
    jwt_token: authToken,
  })
}

export const checkPassword: NextUserHandler = async (req, ctx, next) => {
  const body = await req.json()
  ctx.data = body

  if (!body.password) {
    throw new ReqErr('Password is required')
  }

  if (await hash.bcrypt.compare(body.password, ctx.user.password)) {
    return next()
  }

  throw new ReqErr('Password is incorrect')
}
