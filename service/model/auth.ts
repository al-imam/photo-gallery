import db, { User } from '../db'
import * as hash from '../hash'
import * as userService from './user'
export type UserOrId = User | string

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !(await hash.compare(password, user.password))) {
    throw new Error('Invalid email or password')
  }

  return user
}

export async function checkAuth(
  token: string | undefined | null,
  tokenMode: 'cookie' | 'auth'
) {
  if (!token) throw new Error('Token is required')
  const { payload, iat, mode } = await hash.verify(
    token.replace(/^Bearer /, '')
  )

  if (mode !== tokenMode) throw new Error('Token is invalid')
  const user = await userService.get(payload)
  if (!user) throw new Error('User not found')

  const passChangedAtInSec = Math.floor(user.passwordChangedAt.getTime() / 1000)
  if (iat <= passChangedAtInSec) throw new Error('Token is invalid')

  if (user.hasBeenBanned) throw new Error('User has been banned')

  return user
}

export async function checkAuthVerified(
  token: string | undefined | null,
  tokenMode: 'cookie' | 'auth'
) {
  const user = await checkAuth(token, tokenMode)
  if (!user.isAccountVerified) throw new Error('User is not verified')
  return user
}

export async function checkAuthNotVerified(
  token: string | undefined | null,
  tokenMode: 'cookie' | 'auth'
) {
  const user = await checkAuth(token, tokenMode)
  if (user.isAccountVerified) throw new Error('User is verified')
  return user
}
