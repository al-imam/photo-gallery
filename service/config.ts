import { User } from '@prisma/client'
import { Prettify } from './utils'

export const USER_PUBLIC_FIELDS = [
  'id',
  'role',
  'name',
  'avatar_sm',
  'avatar_md',
  'avatar_lg',
  'username',
  'hasBeenBanned',
] as const

export const USER_SAFE_FIELDS = [
  ...USER_PUBLIC_FIELDS,
  'email',
  'createdAt',
] as const

let keys = 0 as unknown as (typeof USER_SAFE_FIELDS)[number]
keys satisfies keyof User

function createQuery<T extends readonly string[]>(args: T) {
  return Object.fromEntries(args.map((a) => [a, true])) as Prettify<
    Record<T[number], true>
  >
}

export const USER_PUBLIC_FIELDS_QUERY = createQuery(USER_PUBLIC_FIELDS)
export const USER_SAFE_FIELDS_QUERY = createQuery(USER_SAFE_FIELDS)
