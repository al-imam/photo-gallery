import * as hash from '../hash'
import db, { User } from '../db'
import { PrettifyPick } from '../utils'
import mail from '../mail'
import ReqErr from '../ReqError'

export function fetchById(id: string) {
  return db.user.findUniqueOrThrow({ where: { id } })
}

export type UserCreateBody = PrettifyPick<User, 'name' | 'password'>
export async function create(token: string, data: UserCreateBody) {
  const { payload: email } = await hash.jwt.verify('signup-email', token)

  const user = await db.user.create({
    data: {
      email,
      name: data.name,
      password: await hash.bcrypt.encrypt(data.password),
    },
  })

  await db.profile.create({
    data: {
      id: user.id,
    },
  })

  return user
}

export type UserUpdateBody = PrettifyPick<User, never, 'name'>
export function update(userId: string, data: UserUpdateBody) {
  return db.user.update({
    where: { id: userId },
    data: { name: data.name },
  })
}

export function remove(userId: string) {
  return db.user.delete({ where: { id: userId } })
}

export async function requestEmailChange(
  user: PrettifyPick<User, 'id' | 'email'>,
  newEmail: string
) {
  const count = await db.user.count({ where: { email: newEmail } })
  if (count) throw new ReqErr('Email already exists')

  const token = await hash.jwt.sign('change-email', {
    userId: user.id,
    newEmail,
  })

  await mail.sendChangeEmailToken(newEmail, token)
}

export async function confirmEmailChange(token: string) {
  const { payload, iatVerify } = await hash.jwt.verify('change-email', token)
  const user = await db.user.findUniqueOrThrow({
    where: { id: payload.userId },
  })
  iatVerify(user.authModifiedAt)

  return db.user.update({
    where: { id: payload.userId, email: payload.newEmail },
    data: { email: payload.newEmail, authModifiedAt: new Date() },
  })
}

export async function requestPasswordReset(email: string) {
  const user = await db.user.findUniqueOrThrow({ where: { email } })
  const token = await hash.jwt.sign('reset-password', {
    userId: user.id,
    email: user.email,
  })

  await mail.sendResetToken(email, token)
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  const { payload, iatVerify } = await hash.jwt.verify('reset-password', token)
  const user = await db.user.findUniqueOrThrow({
    where: { id: payload.userId, email: payload.email },
  })
  iatVerify(user.authModifiedAt)

  return changePassword(user.id, newPassword)
}

export async function changePassword(userId: string, newPassword: string) {
  if (newPassword.length < 6) {
    throw new ReqErr('Password is too short min length is 6')
  }
  if (newPassword.length > 64) {
    throw new ReqErr('Password is too long max length is 32')
  }

  return db.user.update({
    where: { id: userId },
    data: {
      password: await hash.bcrypt.encrypt(newPassword),
      authModifiedAt: new Date(),
    },
  })
}

export async function changeUsername(userId: string, newUsername: string) {
  if (newUsername.length < 4) throw new ReqErr('Username is too short')
  if (newUsername.length > 32) throw new ReqErr('Username is too long')
  if (!/^[a-z0-9\_\-]+$/i.test(newUsername)) {
    throw new ReqErr(
      'Invalid username, only alphanumeric, underscore and hyphen are allowed'
    )
  }

  return db.user.update({
    where: { id: userId },
    data: { username: newUsername.toLowerCase() },
  })
}
