import * as bcrypt from 'bcryptjs'
import * as jose from 'jose'
import env from './env'

const characters = '0123456789'
const charactersLength = characters.length
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export async function generateOTP(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return [result, await bcrypt.hash(result, 2)]
}

export async function encrypt(plain: string) {
  if (!plain) throw new Error('Text is required')
  return bcrypt.hash(plain, 2)
}

export async function compare(plain: string, hash: string) {
  if (!plain) throw new Error('Text is required')
  return bcrypt.compare(plain, hash)
}

export async function sign(payload: string, mode: 'cookie' | 'auth') {
  return new jose.SignJWT({ payload, mode })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verify(token: string) {
  const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
    algorithms: ['HS256'],
  })
  return payload as {
    payload: string
    mode: 'cookie' | 'auth'
    iat: number
    exp: number
  }
}
