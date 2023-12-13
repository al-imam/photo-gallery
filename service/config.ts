import { Prettify } from './utils'

export const USER_PUBLIC_FIELDS = [
  'id',
  'role',
  'name',
  'avatar',
  'hasBeenBanned',
] as const

export const USER_PUBLIC_FIELDS_QUERY = Object.fromEntries(
  USER_PUBLIC_FIELDS.map((a) => [a, true])
) as Prettify<Record<(typeof USER_PUBLIC_FIELDS)[number], true>>

export const USER_SAFE_FIELDS = [
  ...USER_PUBLIC_FIELDS,
  'isAccountVerified',
  'createdAt',
  'email',
] as const
