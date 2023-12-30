import ReqErr from '../ReqError'
import db from '../db'
import * as hash from '../hash'
import mail from '../mail'
import * as userService from './user'

export async function checkAuth(
  token: string | undefined | null,
  tokenMode: 'cookie' | 'auth'
) {
  if (!token) throw new ReqErr('Token is required')
  const { payload, iatVerify } = await hash.jwt.verify(
    tokenMode,
    token.replace(/^Bearer /, '')
  )

  const user = await userService.fetchById(payload)
  if (user.role === 'BANNED') throw new ReqErr('User has been banned')
  iatVerify(user.authModifiedAt)

  return user
}

export async function signup(email: string) {
  const isAlreadyExist = await db.user.findUnique({ where: { email } })
  if (isAlreadyExist) throw new ReqErr('Already exist')

  const token = await hash.jwt.sign('signup-email', email)
  await mail.sendSignupToken(email, token)
}

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !(await hash.bcrypt.compare(password, user.password))) {
    throw new ReqErr('Invalid email or password')
  }

  return user
}
