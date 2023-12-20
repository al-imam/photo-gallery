import { Media, MediaReaction, User } from '@prisma/client'
import { Prettify } from '@/types'
import db from '@/service/db'
import { MediaWithLoves } from '@/service/types'
import ReqErr from '@/service/ReqError'
import { PrettifyPick } from '@/service/utils'

export function mediaPermissionFactory(
  media: PrettifyPick<Media, 'authorId' | 'status'>
) {
  return {
    view(user?: Pick<User, 'id' | 'status'> | null) {
      return media.status === 'APPROVED' || this.edit(user)
    },

    edit(user?: Pick<User, 'id' | 'status'> | null) {
      return Boolean(
        user && (media.authorId === user.id || this.moderate(user))
      )
    },

    moderate(user?: Pick<User, 'id' | 'status'> | null) {
      return Boolean(
        user && (user.status === 'ADMIN' || user.status === 'MODERATOR')
      )
    },

    delete(user?: Pick<User, 'id' | 'status'> | null) {
      return Boolean(
        user && (user.id === media.authorId || user.status === 'ADMIN')
      )
    },
  }
}

export async function checkIfCategoryExists(categoryId: string) {
  if (!categoryId) return
  const category = await db.mediaCategory.findUnique({
    where: { id: categoryId },
  })

  if (!category) throw new ReqErr('Category not found')
}

export async function findOrCreateCategory(name: string) {
  const lowerName = name.toLowerCase()
  return (
    (await db.mediaCategory.findFirst({ where: { name: lowerName } })) ??
    (await db.mediaCategory.create({ data: { name: lowerName } }))
  )
}

function mapMediaReaction<
  T extends Pick<MediaReaction, 'mediaId' | 'userId'>[],
>(array: T) {
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

  const reactions = mapMediaReaction(
    await db.mediaReaction.findMany({
      where: { mediaId: { in: mediaList.map((m) => m.id) } },
      select: { mediaId: true, userId: true },
    })
  )

  for (const media of mediaList) {
    result.push({
      ...media,
      isLoved: Boolean(userId && reactions[media.id]?.has(userId)),
      loves: reactions[media.id]?.size ?? 0,
      messageId: undefined as never,
    })
  }

  return result
}
