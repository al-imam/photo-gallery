import { Media, MediaReaction, Prisma, User } from '@prisma/client'
import { Prettify } from '@/types'
import db from '@/service/db'
import { MediaWithReactionCount, MediaWithLoves } from '@/service/types'
import { PrettifyPick } from '@/service/utils'
const INSENSITIVE = 'insensitive' as const

export function mediaPermissionFactory(
  media: PrettifyPick<Media, 'authorId' | 'status'>
) {
  return {
    view(user?: Pick<User, 'id' | 'role'> | null) {
      return media.status === 'APPROVED' || this.edit(user)
    },

    edit(user?: Pick<User, 'id' | 'role'> | null) {
      return Boolean(
        user && (media.authorId === user.id || this.moderate(user))
      )
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

export async function findOrCreateCategory(name: string) {
  const lowerName = name.toLowerCase()
  return (
    (await db.mediaCategory.findFirst({ where: { name: lowerName } })) ??
    (await db.mediaCategory.create({ data: { name: lowerName } }))
  )
}

export async function addLovesToMedia<
  T extends MediaWithReactionCount[] | MediaWithReactionCount,
>(
  media: T,
  userId?: null | string
): Promise<T extends any[] ? MediaWithLoves[] : MediaWithLoves> {
  async function work(...args: MediaWithReactionCount[]) {
    const userAndMedia = userId
      ? await db.mediaReaction.findMany({
          where: { mediaId: { in: args.map((m) => m.id) }, userId },
          select: { mediaId: true },
        })
      : []

    const mediaIdSet = new Set(userAndMedia.map((m) => m.mediaId))

    return args.map(({ _count, messageId: _, ...media }) => ({
      ...media,
      loves: _count.Z_REACTIONS ?? 0,
      isLoved: mediaIdSet.has(media.id),
    }))
  }

  if (Array.isArray(media)) return work(...media) as any
  return (await work(media))[0] as any
}

function isUUID(uuidString: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(uuidString)
}

export function mediaSearchQueryOR(query?: string): Prisma.MediaWhereInput[] {
  if (!query) return []
  const keywords = query.trim().split(' ').filter(Boolean)

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
