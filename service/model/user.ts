import * as hash from '../hash'
import db, { User } from '../db'
import { PrettifyPick } from '../utils'
import { sendOTPToEmail } from '../mail'

async function checkIfEmailAvailability(email: string) {
  const count = await db.user.count({
    where: { OR: [{ email }, { email_pending: email }] },
  })

  return count === 0
}

export function fetch(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function create(
  data: PrettifyPick<User, 'name' | 'email' | 'password', 'avatar'>
) {
  const count = await checkIfEmailAvailability(data.email)
  if (!count) throw new Error('Email already exists')

  const [code, hashedCode] = await hash.generateOTP(6)

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      password: await hash.encrypt(data.password),
      email_verificationCode: hashedCode,
    },
  })

  sendOTPToEmail(user.email, code)
  return user
}

export function update(
  userId: string,
  data: PrettifyPick<User, never, 'avatar' | 'name'>
) {
  return db.user.update({
    where: { id: userId },
    data,
  })
}

export function remove(userId: string) {
  return db.user.delete({ where: { id: userId } })
}

export async function verifyAccount(
  user: PrettifyPick<
    User,
    'id' | 'isAccountVerified' | 'email_pending' | 'email_verificationCode'
  >,
  code: string
) {
  if (!user.email_verificationCode) {
    throw new Error('No verification process is pending')
  }

  if (!(await hash.compare(code, user.email_verificationCode))) {
    throw new Error('Invalid verification code')
  }

  if (!user.isAccountVerified) {
    return db.user.update({
      where: { id: user.id },
      data: { isAccountVerified: true, email_verificationCode: null },
    })
  }

  if (user.email_pending) {
    return db.user.update({
      where: { id: user.id },
      data: {
        email: user.email_pending!,
        email_pending: null,
        email_verificationCode: null,
      },
    })
  }

  throw new Error('Something went wrong!!')
}

export async function resendEmailVerificationCode(
  user: PrettifyPick<User, 'id' | 'email_verificationCode'>
) {
  if (!user) throw new Error('User not found')
  if (!user.email_verificationCode) {
    throw new Error('No verification process is pending')
  }

  if (user.email_verificationCode) {
    const [code, hashedCode] = await hash.generateOTP(6)
    const newUser = await db.user.update({
      where: { id: user.id },
      data: { email_verificationCode: hashedCode },
    })

    sendOTPToEmail(newUser.email, code)
    return newUser
  }

  throw new Error('Something went wrong!!')
}

export async function changePassword(userId: string, password: string) {
  return db.user.update({
    where: { id: userId },
    data: {
      password: await hash.encrypt(password),
      passwordChangedAt: new Date(),
    },
  })
}

export async function changeEmail(userId: string, newEmail: string) {
  const count = await checkIfEmailAvailability(newEmail)
  if (!count) throw new Error('Email already exists')

  const newUser = await db.user.update({
    where: { id: userId },
    data: { email_pending: newEmail },
  })

  await resendEmailVerificationCode(newUser)
  return newUser
}
