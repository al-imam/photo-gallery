import { Media, Prisma, User } from '@prisma/client'
import db from '@/service/db'
import { MediaWithReactionCountRaw, MediaWithLoves } from '@/service/types'
import { PrettifyPick, isUUID } from '@/service/utils'

const INSENSITIVE = 'insensitive' as const

export function mediaPermissionFactory(
  media: PrettifyPick<Media, 'authorId' | 'status'>
) {
  return {
    view(user?: Pick<User, 'id' | 'role'> | null) {
      return media.status === 'APPROVED' || this.edit(user)
    },

    edit(user?: Pick<User, 'id' | 'role'> | null) {
      return Boolean(user && media.authorId === user.id)
    },

    moderate(user?: Pick<User, 'id' | 'role'> | null) {
      return Boolean(
        user && (user.role === 'ADMIN' || user.role === 'MODERATOR')
      )
    },

    delete(user?: Pick<User, 'id' | 'role'> | null) {
      return Boolean(
        user && (user.id === media.authorId || user.role === 'ADMIN')
      )
    },
  }
}

export async function AddLoveToMediaCore(
  media: MediaWithReactionCountRaw[],
  userId?: string
) {
  const userAndMedia = userId
    ? await db.mediaReaction.findMany({
        where: { mediaId: { in: media.map((m) => m.id) }, userId },
        select: { mediaId: true },
      })
    : []

  const mediaIdSet = new Set(userAndMedia.map((m) => m.mediaId))

  return function (...args: MediaWithReactionCountRaw[]) {
    return args.map<MediaWithLoves>(({ messageId: _, ...media }) => ({
      ...media,
      isLoved: mediaIdSet.has(media.id),
    }))
  }
}

export async function addLovesToMedia<
  T extends MediaWithReactionCountRaw[] | MediaWithReactionCountRaw,
>(media: T, userId?: string) {
  const isArrayMode = Array.isArray(media)
  const add = await AddLoveToMediaCore(isArrayMode ? media : [media], userId)

  return (isArrayMode ? add(...media) : add(media)[0]) as T extends any[]
    ? MediaWithLoves[]
    : MediaWithLoves
}

export function mediaSearchQueryOR(query?: string): Prisma.MediaWhereInput[] {
  if (!query) return []
  const keywords = query.trim().split(' ').filter(Boolean)
  if (!keywords.length) return []

  const idQueryList = isUUID(query) && [
    { id: query },
    { authorId: query },
    { categoryId: query },
  ]

  const queryList = keywords.map((keyword) => [
    {
      title: { contains: keyword, mode: INSENSITIVE },
    },
    {
      description: { contains: keyword, mode: INSENSITIVE },
    },
    {
      category: {
        name: { contains: keyword, mode: INSENSITIVE },
      },
    },
    {
      author: {
        name: { contains: keyword, mode: INSENSITIVE },
      },
    },
    {
      author: {
        profile: {
          email: { contains: keyword, mode: INSENSITIVE },
        },
      },
    },
  ])

  const otherQueryList = [
    { tags: { hasEvery: keywords } },
    { tags: { hasSome: keywords } },
  ]

  return [...(idQueryList || []), ...queryList.flat(1), ...otherQueryList]
}

export function validateAndFormatTags(tags?: string[]) {
  if (!Array.isArray(tags) || !tags.length) return undefined

  const formattedTags = tags
    .filter(Boolean)
    .map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ''))

  const finalTags = Array.from(new Set(formattedTags))

  if (finalTags.length > 7) {
    throw new Error('Cannot provide more than 7 tags')
  }

  return finalTags
}
