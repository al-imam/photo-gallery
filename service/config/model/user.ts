import { createIncludeQuery } from '../../utils'

export const publicFields = [
  'id',
  'name',
  'role',
  'avatar_sm',
  'avatar_md',
  'avatar_lg',
  'username',
] as const

export const safeFields = [...publicFields, 'email'] as const

export const selectSafeFields = createIncludeQuery(safeFields)

export const selectPublicFields = createIncludeQuery(publicFields)
