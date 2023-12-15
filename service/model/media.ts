import { USER_PUBLIC_FIELDS_QUERY } from '../config'
import db, { Media, MediaReaction } from '../db'
import { MediaWithLoves } from '../types'
import { Prettify } from '../utils'

function groupBy<T extends Pick<MediaReaction, 'mediaId' | 'userId'>[]>(
  array: T,
  key: keyof T[number]
) {
  const result: Prettify<Record<string, Set<string>>> = {}
  array.forEach(({ mediaId, userId }) => {
    if (!result[mediaId]) {
      result[mediaId] = new Set()
    }
    result[mediaId].add(userId)
  })

  return result
}

export async function addLovesToMediaList(
  userId?: null | string,
  ...mediaList: Media[]
) {
  const result: MediaWithLoves[] = []

  const reactions = groupBy(
    await db.mediaReaction.findMany({
      where: { mediaId: { in: mediaList.map((m) => m.id) } },
      select: { mediaId: true, userId: true },
    }),
    'mediaId'
  )

  for (const media of mediaList) {
    result.push({
      ...media,
      isLoved: Boolean(userId && reactions[media.id]?.has(userId)),
      loves: reactions[media.id]?.size ?? 0,
    })
  }

  return result
}

export type MediaOptions = {
  limit?: number
  skip?: number
  category?: string
  authorId?: string
}

export async function getFeaturedMedia(
  userId?: null | string,
  options: MediaOptions = {}
) {
  const media = await db.media.findMany({
    where: {
      status: 'APPROVED',
      categoryId: options.category,
      authorId: options.authorId,
    },
    orderBy: {
      id: 'desc',
    },
    take: options.limit,
    skip: options.skip,
    include: {
      author: { select: USER_PUBLIC_FIELDS_QUERY },
      category: true,
    },
  })

  return addLovesToMediaList(userId, ...media)
}
