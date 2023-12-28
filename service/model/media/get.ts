import { addLovesToMediaList, mediaPermissionFactory } from './helpers'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { ContentStatus, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { FeaturedMediaOptions } from './types'
import ReqErr from '@/service/ReqError'
import { userPermissionFactory } from '../helpers'

export async function getMedia(
  id: string,
  user?: PrettifyPick<User, 'id' | 'status'>
) {
  const media = await db.media.findUnique({
    where: { id },
    include: MEDIA_INCLUDE_QUERY,
  })

  if (media && mediaPermissionFactory(media).view(user)) return media
  throw new ReqErr('Media not found')
}

export async function getLatestMediaList(
  user?: PrettifyPick<User, 'id' | 'status'>,
  options: FeaturedMediaOptions = {}
) {
  if (
    options.status &&
    !(
      user &&
      ((options.authorId && user.id === options.authorId) ||
        userPermissionFactory(user).isModeratorLevel)
    )
  ) {
    delete options.status
  }

  const mediaList = await db.media.findMany({
    ...(options.cursor
      ? { cursor: { id: options.cursor }, skip: 1 }
      : undefined),
    take: options.limit ?? 20,

    where: {
      status: options.status ?? ContentStatus.APPROVED,
      authorId: options.authorId,
      categoryId: options.category,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: MEDIA_INCLUDE_QUERY,
  })

  return addLovesToMediaList(user?.id, ...mediaList)
}

export async function getBackup(cursor?: string, take = 20000) {
  const mediaList = await db.media.findMany({
    take,
    where: {},
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : undefined),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url_media: true,
    },
  })

  return mediaList
}
