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
      opt_emailVerificationCode: hashedCode,
      opt_emailVerificationCodeExp: new Date(
        Date.now() + 1000 * 60 * 10 /* 10 minutes */
      ),
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
    | 'id'
    | 'isAccountVerified'
    | 'email_pending'
    | 'opt_emailVerificationCode'
    | 'opt_emailVerificationCodeExp'
  >,
  code: string
) {
  if (!user.opt_emailVerificationCode) {
    throw new Error('No verification process is pending')
  }

  if (
    !(
      (await hash.compare(code, user.opt_emailVerificationCode)) &&
      user.opt_emailVerificationCodeExp! > new Date()
    )
  ) {
    throw new Error('Invalid verification code')
  }

  if (!user.isAccountVerified) {
    return db.user.update({
      where: { id: user.id },
      data: { isAccountVerified: true, opt_emailVerificationCode: null },
    })
  }

  if (user.email_pending) {
    return db.user.update({
      where: { id: user.id },
      data: {
        email: user.email_pending!,
        email_pending: null,
        opt_emailVerificationCode: null,
      },
    })
  }

  throw new Error('Something went wrong!!')
}

export async function resendEmailVerificationCode(
  user: PrettifyPick<User, 'id' | 'opt_emailVerificationCode'>
) {
  if (!user) throw new Error('User not found')
  if (!user.opt_emailVerificationCode) {
    throw new Error('No verification process is pending')
  }

  if (user.opt_emailVerificationCode) {
    const [code, hashedCode] = await hash.generateOTP(6)
    const newUser = await db.user.update({
      where: { id: user.id },
      data: {
        opt_emailVerificationCode: hashedCode,
        opt_emailVerificationCodeExp: new Date(
          Date.now() + 1000 * 60 * 10 /* 10 minutes */
        ),
      },
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
