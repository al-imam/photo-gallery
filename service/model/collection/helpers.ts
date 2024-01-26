import config from '@/service/config'
import { CollectionWithMedia, CollectionWithRawMedia } from '@/service/types'
import { PrettifyPick } from '@/service/utils'
import { Collection } from '@prisma/client'
import { PaginationQueries } from '@/service/helpers'
import { addLovesToMedia } from '../media/helpers'

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
    media: { include: config.media.includePublicFields },
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
