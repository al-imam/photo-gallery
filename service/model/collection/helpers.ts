import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import { CollectionWithMedia, CollectionWithRawMedia } from '@/service/types'
import { addLovesToMedia } from '../media/helpers'
import { PrettifyPick } from '@/service/utils'
import { Collection } from '@prisma/client'
import { PaginationQueries } from '@/service/helpers'

export const countPopulation = {
  include: {
    _count: {
      select: {
        media: true,
      },
    },
  },
}

export const mediaPopulation = {
  include: {
    media: { include: MEDIA_INCLUDE_QUERY },
  },
}

export async function formatCollection(
  collection: CollectionWithRawMedia,
  userId?: string
): Promise<CollectionWithMedia> {
  const media = await addLovesToMedia(collection.media, userId)

  return {
    ...collection,
    media: media.map((media) => {
      return media.authorId === userId || media.status === 'APPROVED'
        ? media
        : null
    }),
  }
}

export type CreateCollectionInput = PrettifyPick<
  Collection,
  'name',
  'visibility' | 'description'
>

export type GetCollectionsQuery = PaginationQueries &
  PrettifyPick<Collection, never, 'visibility' | 'userId'>
