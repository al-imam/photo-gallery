import {
  GetCollectionsQuery,
  CreateCollectionInput,
} from '@/service/model/collection/helpers'
import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/next/router'

export type GetQuery = GetCollectionsQuery
export const GET = authRouter(async (_, ctx) => {
  const { userId: userIdFromQuery, ...query } = ctx.query<GetQuery>()

  const userId = userIdFromQuery ?? ctx.user.id
  const collections = await service.collection.getCollections(userId, {
    ...query,
    ...(userIdFromQuery === userId ? {} : { visibility: 'PUBLIC' }),
  })

  return NextResponse.json({ collections })
})

export type PostBody = CreateCollectionInput
export const POST = authRouter(async (_, ctx) => {
  const collection = await service.collection.createCollection(
    ctx.user.id,
    ctx.body<PostBody>()
  )

  return NextResponse.json({ collection })
})
