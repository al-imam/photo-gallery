import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { USER_SAFE_FIELDS } from '/service/config'
import * as hash from '/service/hash'
import { NextUserHandler } from '/service/types'
import { pick } from '/service/utils'

export const sendUserAndToken: NextUserHandler = async (req, ctx) => {
  const cookieToken = await hash.sign(ctx.user.id, 'cookie')
  const authToken = await hash.sign(ctx.user.id, 'auth')

  cookies().set({
    name: 'authorization',
    value: cookieToken,
    path: '/',
    httpOnly: true,
    maxAge: Date.now() + 86400000 * 30,
  })

  return NextResponse.json({
    data: {
      user: pick(ctx.user, ...USER_SAFE_FIELDS),
      jwt_token: authToken,
    },
  })
}
