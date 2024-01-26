import { Prisma } from '../db'
import magic from '../magic'
import { createIncludeQuery } from '../utils'

export const user = magic(Prisma.UserScalarFieldEnum)
  .create(
    'publicFields',

    'id',
    'name',
    'role',
    'avatar_sm',
    'avatar_md',
    'avatar_lg',
    'username'
  )
  .create(
    'mediaFields',
    'id',
    'name',
    'role',
    'avatar_sm',
    'avatar_md',
    'avatar_lg'
  )
  .createFrom('publicFields', 'safeFields', 'email')
  .parse()

export const userQuery = {
  selectPublicFields: createIncludeQuery(user.publicFields),
  selectSafeFields: createIncludeQuery(user.safeFields),
}

export const media = magic(Prisma.MediaScalarFieldEnum)
  .create(
    'publicFields',

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
  .parse()

export const mediaQuery = {
  includePublicFields: {
    author: { select: userQuery.selectPublicFields },
    category: true,
    _count: {
      select: { reactions: true },
    },
  },
}
