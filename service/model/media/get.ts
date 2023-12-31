import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import db, { ContentStatus, Media, Prisma, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { mediaPermissionFactory } from './helpers'
import { userPermissionFactory } from '../helpers'
import { MediaWithReactionCount } from '@/service/types'

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

export async function getRelatedMedia(
  media: PrettifyPick<
    Media,
    'id',
    'title' | 'tags' | 'description' | 'categoryId'
  >,
  take = 9
) {
  const related: MediaWithReactionCount[] = []
  const whereQuery: Prisma.MediaWhereInput[] = []

  if (media.tags?.length) {
    whereQuery.push({ tags: { hasEvery: media.tags } })
  }

  if (media.title) {
    whereQuery.push({
      title: {
        contains: media.title,
        mode: 'insensitive' as const,
      },
    })
  }

  if (media.description) {
    whereQuery.push({
      description: {
        contains: media.description,
        mode: 'insensitive' as const,
      },
    })
  }

  if (media.tags?.length) {
    whereQuery.push({ tags: { hasSome: media.tags } })
  }

  if (media.categoryId) {
    whereQuery.push({ categoryId: media.categoryId })
  }

  for (let where of whereQuery) {
    const remaining = take - related.length
    if (remaining <= 0) break

    const matchedMediaList = await db.media.findMany({
      take: remaining,
      include: MEDIA_INCLUDE_QUERY,
      orderBy: { createdAt: 'desc' },
      where: {
        ...where,
        id: { not: { in: [media.id, ...related.map((media) => media.id)] } },
      },
    })

    related.push(...matchedMediaList)
  }

  return related
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

  return mediaList
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
