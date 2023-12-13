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

export async function addLovesToMedia(
  userId?: null | string,
  ...mediaList: Media[]
) {
  const result: MediaWithLoves[] = []

  console.log(
    'Created:',
    await db.mediaReaction.create({
      data: {
        mediaId: '6579cdac90c86821408ef6ac',
        userId: '6579cd8c24947f383244330d',
      },
    })
  )

  const reactions = groupBy(
    await db.mediaReaction.findMany({
      where: { mediaId: { in: mediaList.map((m) => m.id) } },
      select: { mediaId: true, userId: true },
    }),
    'mediaId'
  )

  for (let media of mediaList) {
    result.push({
      ...media,
      isLoved: Boolean(userId && reactions[media.id]?.has(userId)),
      loves: reactions[media.id]?.size ?? 0,
    })
  }

  return result
}
