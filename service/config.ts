import { User } from '@prisma/client'
import { Prettify } from './utils'

export const USER_PUBLIC_FIELDS = [
  'id',
  'role',
  'name',
  'avatar',
  'username',
  'hasBeenBanned',
] as const

export const USER_PUBLIC_FIELDS_QUERY = Object.fromEntries(
  USER_PUBLIC_FIELDS.map((a) => [a, true])
) as Prettify<Record<(typeof USER_PUBLIC_FIELDS)[number], true>>

export const USER_SAFE_FIELDS = [
  ...USER_PUBLIC_FIELDS,
  'email',
  'createdAt',
] as const

let keys = 0 as unknown as (typeof USER_SAFE_FIELDS)[number]
keys satisfies keyof User
