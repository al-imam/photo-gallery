import * as user from './user'

export const publicFields = [
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
  'url_thumbnail',
] as const

export const includePublicFields = {
  author: { select: user.selectPublicFields },
  category: true,
  _count: {
    select: { reactions: true },
  },
}
