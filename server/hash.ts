import * as bcrypt from 'bcryptjs'
import * as jose from 'jose'

const characters = '0123456789'
const charactersLength = characters.length

const secret = new TextEncoder().encode('cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2')
const alg = 'HS256'

export async function generateOTP(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return [result, await bcrypt.hash(result, 2)]
}

export async function encrypt(plain: string) {
  if (!plain) throw new Error('Password is required')
  return bcrypt.hash(plain, 2)
}

export async function compare(plain: string, hash: string) {
  if (!plain) throw new Error('Password is required')
  return bcrypt.compare(plain, hash)
}

export async function sign(payload: string, mode: 'cookie' | 'auth') {
  return new jose.SignJWT({ payload, mode })
    .setProtectedHeader({ alg })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(secret)
}

export async function verify(token: string) {
  const { payload } = await jose.jwtVerify(token, secret, { algorithms: [alg] })
  return payload as {
    payload: string
    mode: 'cookie' | 'auth'
    iat: number
    exp: number
  }
}
