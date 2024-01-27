import {
  GetCollectionsQuery,
  CreateCollectionInput,
} from '@/service/model/collection/helpers'
import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/router'

export type GetQuery = GetCollectionsQuery
export type GetData = {
  collections: Awaited<ReturnType<typeof service.collection.getCollections>>
}
export const GET = authRouter(async (_, ctx) => {
  const { userId: userIdFromQuery, ...query } = ctx.query<GetQuery>()
  const userId = userIdFromQuery ?? ctx.user.id

  const collections = await service.collection.getCollections(userId, {
    ...query,
    ...(ctx.user.id === userId ? {} : { visibility: 'PUBLIC' }),
  })

  return NextResponse.json<GetData>({ collections })
})

export type PostBody = CreateCollectionInput
export type PostData = {
  collection: Awaited<ReturnType<typeof service.collection.createCollection>>
}
export const POST = authRouter(async (_, ctx) => {
  const collection = await service.collection.createCollection(
    ctx.user.id,
    ctx.body<PostBody>()
  )

  return NextResponse.json<PostData>({ collection })
})
