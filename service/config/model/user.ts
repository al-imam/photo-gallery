import { createIncludeQuery } from '../../utils'
import model from './_helper'

export const publicFields = model.User(
  'id',
  'name',
  'role',
  'avatar_sm',
  'avatar_md',
  'avatar_lg',
  'username'
)

export const safeFields = model.User(...publicFields, 'email')

export const selectSafeFields = createIncludeQuery(safeFields)

export const selectPublicFields = createIncludeQuery(publicFields)
