import env from './env'
import * as jose from 'jose'
import * as bcryptjs from 'bcryptjs'
import { JWTPayload } from './types'
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export const bcrypt = {
  async encrypt(plain: string) {
    if (!plain) throw new Error('Text is required')
    return bcryptjs.hash(plain, env.BCRYPT_SALT_ROUNDS)
  },

  async compare(plain: string, hash: string) {
    if (!plain) throw new Error('Text is required')
    return bcryptjs.compare(plain, hash)
  },
}

export const jwt = {
  sign<T extends keyof JWTPayload>(mode: T, payload: JWTPayload[T]) {
    return new jose.SignJWT({ payload, mode })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .setIssuedAt()
      .sign(JWT_SECRET)
  },

  async verify<T extends keyof JWTPayload>(mode: T, token: string) {
    type Payload = {
      payload: JWTPayload[T]
      mode: T
      iat: number
      exp: number
    }

    const { payload } = await jose.jwtVerify<Payload>(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
    if (payload.mode !== mode) throw new Error('Invalid token')

    return {
      ...(payload as Payload),
      iatVerify(authModifiedAt: Date) {
        const authModifiedAtInSec = Math.floor(authModifiedAt.getTime() / 1000)
        if (payload.iat < authModifiedAtInSec) {
          throw new Error('Token is expired due to email or password change')
        }
      },
    }
  },
}
