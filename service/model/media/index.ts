import { addLovesToMediaList } from './helpers'
import { checkIfCategoryExists, checkIfUserCanEdit } from './helpers'
import { FeaturedMediaOptions, UpdateMediaBody } from './types'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'

export async function getFeaturedMedia(
  userId?: null | string,
  options: FeaturedMediaOptions = {}
) {
  const media = await db.media.findMany({
    ...(options.cursor
      ? { cursor: { id: options.cursor }, skip: 1 }
      : undefined),
    take: options.limit,

    where: {
      status: 'APPROVED',
      categoryId: options.category,
      authorId: options.authorId,
    },
    orderBy: {
      id: 'desc',
    },
    include: MEDIA_INCLUDE_QUERY,
  })

  return addLovesToMediaList(userId, ...media)
}

// TODO: Add loves to media
export async function updateMedia(
  user: PrettifyPick<User, 'id' | 'status'>,
  id: string,
  body: UpdateMediaBody
) {
  const oldMedia = await db.media.findUnique({ where: { id } })
  if (!oldMedia) throw new Error('Media not found')
  checkIfUserCanEdit(user, oldMedia)
  body.categoryId && (await checkIfCategoryExists(body.categoryId))

  const media = await db.media.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      note: body.note,
      media_hasGraphicContent: body.media_hasGraphicContent,
      categoryId: body.categoryId,
      tags: body.tags,
    },
    include: MEDIA_INCLUDE_QUERY,
  })

  return media
}
