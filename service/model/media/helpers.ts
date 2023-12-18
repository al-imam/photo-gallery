import { Media, MediaReaction, User } from '@prisma/client'
import { Prettify } from '/types'
import db from '/service/db'
import { MediaWithLoves } from '/service/types'

export function checkIfUserCanEdit(
  user: Pick<User, 'id' | 'status'>,
  media: Media
) {
  const hasPermission =
    media.authorId === user.id ||
    user.status === 'ADMIN' ||
    user.status === 'MODERATOR'

  if (!hasPermission) {
    throw new Error("You don't have permission to update this media")
  }
}

export async function checkIfCategoryExists(categoryId: string) {
  if (!categoryId) return
  const category = await db.mediaCategory.findUnique({
    where: { id: categoryId },
  })

  if (!category) throw new Error('Category not found')
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
    })
  }

  return result
}
