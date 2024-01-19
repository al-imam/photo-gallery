import {
  mediaPopulation,
  countPopulation,
  formatCollection,
  GetCollectionsQuery,
  CreateCollectionInput,
} from './helpers'
import db, { Collection } from '@/service/db'
import { paginationQueries } from '../../helpers'
import { CollectionWithMediaCount } from '@/service/types'

export async function createCollection(
  userId: string,
  data: CreateCollectionInput
) {
  const collection = await db.collection.create({
    data: {
      userId,
      name: data.name,
      visibility: data.visibility,
      description: data.description,
    },
    ...mediaPopulation,
  })

  return formatCollection(collection, userId)
}

export async function getCollections(
  userId: string,
  { visibility, ...query }: GetCollectionsQuery
): Promise<CollectionWithMediaCount[]> {
  const collections = await db.collection.findMany({
    ...paginationQueries<Collection>({
      ...query,
      orderBy: 'desc',
      orderByKey: 'createdAt',
    }),

    where: { userId, visibility },
    ...countPopulation,
  })

  return collections
}

export async function getCollectionById(id: string, userId?: string) {
  const collection = await db.collection.findUniqueOrThrow({
    where: { id, userId, visibility: userId ? undefined : 'PUBLIC' },
    ...mediaPopulation,
  })

  return formatCollection(collection, userId)
}

export async function updateCollection(
  id: string,
  userId: string,
  data: Partial<CreateCollectionInput>
) {
  const collection = await db.collection.update({
    where: { id, userId },
    data: {
      name: data.name,
      visibility: data.visibility,
      description: data.description,
    },
    ...mediaPopulation,
  })

  return formatCollection(collection, userId)
}

export async function addMediaToCollection(
  id: string,
  userId: string,
  mediaId: string
) {
  const collection = await db.collection.update({
    where: { id, userId },
    data: {
      media: {
        connect: {
          id: mediaId,
        },
      },
    },
    ...mediaPopulation,
  })

  return formatCollection(collection, userId)
}

export async function removeMediaFromCollection(
  id: string,
  userId: string,
  mediaId: string
) {
  const collection = await db.collection.update({
    where: { id, userId },
    data: {
      media: {
        disconnect: {
          id: mediaId,
        },
      },
    },
    ...mediaPopulation,
  })

  return formatCollection(collection, userId)
}

export async function deleteCollection(id: string, userId: string) {
  return db.collection.delete({
    where: { id, userId },
  })
}
