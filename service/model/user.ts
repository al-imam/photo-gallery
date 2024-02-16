import * as hash from '../hash'
import db, { User, UserRole } from '../db'
import { PrettifyPick } from '../utils'
import mail from '../mail'
import ReqErr from '../ReqError'
import config from '../config'
import { PaginationQueries, paginationQueries } from '../helpers'

export function fetchById(id: string) {
  return db.user.findUniqueOrThrow({ where: { id } })
}

export function fetchByUsername(username: string) {
  return db.user.findUniqueOrThrow({ where: { username } })
}

export type GetUserListOptions = PaginationQueries &
  Partial<{
    role: UserRole
    search: string
  }>

export async function getUserList(options: GetUserListOptions = {}) {
  return db.user.findMany({
    ...paginationQueries<User>({
      orderByKey: 'id',
      orderBy: 'asc',
      ...options,
    }),

    where: {
      ...(options.role ? { role: options.role } : undefined),
      ...(options.search
        ? {
            OR: [
              { name: { contains: options.search, mode: 'insensitive' } },
              { email: { contains: options.search, mode: 'insensitive' } },
              { username: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : undefined),
    },

    select: config.user.selectPublicFields,
  })
}

export type UserCreateCoreBody = PrettifyPick<
  User,
  'email' | 'password',
  'name'
>
export async function createCore(data: UserCreateCoreBody) {
  const user = await db.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name || data.email.split('@')[0],
    },
  })

  await db.profile.create({
    data: { userId: user.id },
  })

  return user
}

export type UserCreateBody = PrettifyPick<User, 'password', 'name'>
export async function create(token: string, data: UserCreateBody) {
  const { payload: email } = await hash.jwt.verify('signup-email', token)
  const password = await hash.bcrypt.encrypt(data.password)

  return createCore({
    ...data,
    email,
    password,
  })
}

export type UserUpdateBody = PrettifyPick<User, never, 'name'>
export function update(userId: string, data: UserUpdateBody) {
  if (data.name === '') {
    throw new ReqErr('Name cannot be empty')
  }

  return db.user.update({
    where: { id: userId },
    data: { name: data.name },
  })
}

export type UpdateAvatarBody = PrettifyPick<
  User,
  'avatar_storageRecordId' | 'avatar_lg' | 'avatar_md' | 'avatar_sm'
>
export function updateAvatar(userId: string, data: UpdateAvatarBody) {
  return db.user.update({
    where: { id: userId },
    data: {
      avatar_storageRecordId: data.avatar_storageRecordId,
      avatar_lg: data.avatar_lg,
      avatar_md: data.avatar_md,
      avatar_sm: data.avatar_sm,
    },
  })
}

export function remove(user: User) {
  return db.user.update({
    where: { id: user.id },
    data: {
      name: 'DELETED',
      role: 'DELETED',
      password: 'DELETED',

      email: 'DELETED ' + user.id,
      username: 'DELETED ' + user.id,

      avatar_lg: null,
      avatar_md: null,
      avatar_sm: null,
      avatar_storageRecordId: null,

      authModifiedAt: new Date(),

      profile: {
        update: {
          data: {
            bio: null,
            email: null,
            location: null,
            links: { deleteMany: {} },
          },
        },
      },
    },
  })
}

export type ChangeStatusBody = { role: UserRole; comment?: string }
export async function changeStatus(
  by: User,
  userId: string,
  body: ChangeStatusBody
) {
  const oldUser = await db.user.findUniqueOrThrow({ where: { id: userId } })
  const newUser = await db.user.update({
    where: { id: userId },
    data: { role: body.role },
  })

  await db.lOG_RoleChange.create({
    data: {
      userId: newUser.id,
      moderatedById: by.id,
      role_old: oldUser.role,
      role_new: newUser.role,
      comment: body.comment,
    },
  })

  return newUser
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
    data: { username: newUsername },
  })
}
