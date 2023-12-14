import mail from '../mail'
import * as hash from '../hash'
import db, { User } from '../db'
import { PrettifyPick } from '../utils'
export type UserOrId = User | string

async function checkIfEmailAvailability(email: string) {
  const count = await db.user.count({
    where: { OR: [{ email }, { email_pending: email }] },
  })

  return count === 0
}

async function sendOTPToEmail(email: string, code: string) {
  const text = 'OTP <' + email + '>: ' + code
  mail(email, 'OTP', text)
}

export async function get<
  T extends UserOrId,
  U = T extends string ? true : boolean,
>(userOrId: T, forceUpdate?: U) {
  let user: User | null = null

  if (typeof userOrId === 'string' || forceUpdate) {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id
    user = await db.user.findUnique({ where: { id } })
  }

  if (!user) throw new Error('User not found')
  return user
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

  await sendOTPToEmail(user.email, code)
  return user
}

export async function update(
  userOrId: UserOrId,
  data: PrettifyPick<User, never, 'avatar' | 'name'>
) {
  const user = await get(userOrId)
  return db.user.update({
    where: { id: user.id },
    data,
  })
}

export async function remove(userOrId: UserOrId) {
  const user = await get(userOrId)
  return db.user.delete({ where: { id: user.id } })
}

export async function verifyAccount(userOrId: UserOrId, code: string) {
  const user = await get(userOrId)

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

export async function resendVerificationCode(userOrId: UserOrId) {
  const user = await get(userOrId)

  if (!user) throw new Error('User not found')
  if (!user.email_pending && user.isAccountVerified) {
    throw new Error('No verification process is pending')
  }

  if (user.email_pending) {
    const [code, hashedCode] = await hash.generateOTP(6)
    const newUser = await db.user.update({
      where: { id: user.id },
      data: { email_verificationCode: hashedCode },
    })

    await sendOTPToEmail(newUser.email, code)
    return newUser
  }

  throw new Error('Something went wrong!!')
}

export async function changePassword(userOrId: UserOrId, password: string) {
  const user = await get(userOrId)

  return db.user.update({
    where: { id: user.id },
    data: {
      password: await hash.encrypt(password),
      passwordChangedAt: new Date(),
    },
  })
}

export async function changeEmail(userOrId: UserOrId, email: string) {
  const user = await get(userOrId)

  const count = await checkIfEmailAvailability(email)
  if (!count) throw new Error('Email already exists')

  const newUser = await db.user.update({
    where: { id: user.id },
    data: { email_pending: email },
  })

  await resendVerificationCode(newUser)
  return newUser
}
