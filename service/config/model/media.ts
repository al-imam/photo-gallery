import { createIncludeQuery } from '@/service/utils'
import model from './_helper'
import * as user from './user'

export const publicFields = model.Media(
  'id',
  'title',
  'description',
  'status',
  'authorId',
  'categoryId',
  'createdAt',
  'hasGraphicContent',
  'media_height',
  'media_size',
  'media_width',
  'tags',
  'url_media',
  'url_thumbnail'
)

export const editableFields = model.Media(
  'title',
  'description',
  'categoryId',
  'tags',
  'hasGraphicContent'
)

export const moderateFields = model.Media(
  'status',
  'categoryId',
  'tags',
  'hasGraphicContent'
)

export const selectPublicFields = createIncludeQuery(publicFields)

export const includePublicFields = {
  author: { select: user.selectPublicFields },
  category: true,
  _count: {
    select: { reactions: true },
  },
}
