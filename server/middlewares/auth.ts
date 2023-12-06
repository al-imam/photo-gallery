import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import * as hash from '../hash'
import { NextUserHandler } from '../types'

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
      user: ctx.user,
      jwt_token: authToken,
    },
  })
}
