import { addLovesToMediaList, mediaPermissionFactory } from './helpers'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { FeaturedMediaOptions } from './types'
import ReqErr from '@/service/ReqError'

export async function getMedia(
  id: string,
  user: PrettifyPick<User, 'id' | 'status'>
) {
  const media = (await db.media.findUnique({
    where: { id },
    include: MEDIA_INCLUDE_QUERY,
  }))!

  const permission = mediaPermissionFactory(media)
  if (!permission.view(user)) throw new ReqErr('Media not found')
  return media
}

export async function getFeaturedMedia(
  userId?: null | string,
  options: FeaturedMediaOptions = {}
) {
  const mediaList = await db.media.findMany({
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

  return addLovesToMediaList(userId, ...mediaList)
}
