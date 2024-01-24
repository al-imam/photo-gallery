import env from '@/service/env'
import * as bcryptjs from 'bcryptjs'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export async function generateToken() {
  const bcrypt = await bcryptjs.hash(env.SERVICE_SECRET, env.BCRYPT_SALT_ROUNDS)
  return new jose.SignJWT({ payload: bcrypt, mode: 'service-token' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1m')
    .setIssuedAt()
    .sign(JWT_SECRET)
}
