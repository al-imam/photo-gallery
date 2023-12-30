import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { ContentStatus, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { addLovesToMediaList, mediaPermissionFactory } from './helpers'
import { userPermissionFactory } from '../helpers'

export async function getMedia(
  id: string,
  user?: PrettifyPick<User, 'id' | 'role'>
) {
  const media = await db.media.findUnique({
    where: { id },
    include: MEDIA_INCLUDE_QUERY,
  })

  if (media && mediaPermissionFactory(media).view(user)) return media
  throw new ReqErr('Media not found')
}

export type MediaListOptions = {
  cursor?: string
  limit?: number
  skip?: number
  category?: string
  authorId?: string
  status?: ContentStatus
  search?: string
}
export async function getLatestMediaList(
  user?: PrettifyPick<User, 'id' | 'role'>,
  options: MediaListOptions = {}
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
    skip: options.skip,
    take: options.limit ?? 20,
    ...(options.cursor
      ? { cursor: { id: options.cursor }, skip: 1 }
      : undefined),

    where: {
      status: options.status ?? ContentStatus.APPROVED,
      authorId: options.authorId,
      categoryId: options.category,
      ...(options.search
        ? {
            OR: [
              {
                title: { contains: options.search, mode: 'insensitive' },
              },
              {
                description: { contains: options.search, mode: 'insensitive' },
              },
              {
                category: {
                  name: { contains: options.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : undefined),
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
