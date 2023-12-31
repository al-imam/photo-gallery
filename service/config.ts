import { User } from '@prisma/client'
import { createIncludeQuery } from './utils'

// User fields that can be accessed by anyone
export const USER_PUBLIC_FIELDS = [
  'id',
  'name',
  'role',
  'avatar_sm',
  'avatar_md',
  'avatar_lg',
  'username',
] as const
export const USER_SAFE_FIELDS = [...USER_PUBLIC_FIELDS, 'email'] as const
export const USER_PUBLIC_FIELDS_QUERY = createIncludeQuery(USER_PUBLIC_FIELDS)
export const USER_SAFE_FIELDS_QUERY = createIncludeQuery(USER_SAFE_FIELDS)

const keys = {} as (typeof USER_SAFE_FIELDS)[number]
keys satisfies keyof User

// User fields that needs to be in media
export const MEDIA_INCLUDE_QUERY = {
  author: { select: USER_PUBLIC_FIELDS_QUERY },
  category: true,
  _count: {
    select: { Z_REACTIONS: true },
  },
}
