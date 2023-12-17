import * as hash from '../hash'
import db, { User } from '../db'
import { PrettifyPick } from '../utils'
import mail from '../mail'
import ReqErr from '../ReqError'

export function fetch(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function create(
  token: string,
  data: PrettifyPick<User, 'name' | 'password'>
) {
  const { payload: email } = await hash.jwt.verify('signup-email', token)

  return db.user.create({
    data: {
      email: email,
      name: data.name,
      password: await hash.bcrypt.encrypt(data.password),
    },
  })
}

export function update(
  userId: string,
  data: PrettifyPick<User, never, 'name'>
) {
  return db.user.update({
    where: { id: userId },
    data,
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
    id: user.id,
    email: user.email,
    newEmail,
  })

  mail.sendChangeEmailToken(newEmail, token)
}

export async function confirmEmailChange(token: string) {
  const { payload, iatVerify } = await hash.jwt.verify('change-email', token)
  const user = await db.user.findUnique({ where: { id: payload.id } })
  if (!user) throw new ReqErr('User not found')
  iatVerify(user.authModifiedAt)

  return db.user.update({
    where: { id: payload.id, email: payload.email },
    data: { email: payload.newEmail, authModifiedAt: new Date() },
  })
}

export async function requestPasswordReset(email: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) throw new ReqErr('User not found')
  const token = await hash.jwt.sign('reset-password', {
    id: user.id,
    email: user.email,
  })

  mail.sendResetToken(email, token)
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  const { payload, iatVerify } = await hash.jwt.verify('reset-password', token)
  const user = await db.user.findUniqueOrThrow({
    where: { id: payload.id, email: payload.email },
  })
  iatVerify(user.authModifiedAt)

  return db.user.update({
    where: { id: payload.id },
    data: {
      password: await hash.bcrypt.encrypt(newPassword),
      authModifiedAt: new Date(),
    },
  })
}

export async function changePassword(userId: string, newPassword: string) {
  return db.user.update({
    where: { id: userId },
    data: {
      password: await hash.bcrypt.encrypt(newPassword),
      authModifiedAt: new Date(),
    },
  })
}

export async function changeUsername(userId: string, newUsername: string) {
  if (newUsername.length < 3) throw new ReqErr('Username is too short')
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
