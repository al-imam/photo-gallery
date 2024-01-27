import { authRouter } from '@/server/router'
import service from '@/service'
import { CreateCollectionInput } from '@/service/model/collection/helpers'
import { CollectionWithMedia } from '@/service/types'
import { NextResponse } from 'next/server'

export type GetData = { collection: CollectionWithMedia }
export const GET = authRouter(async (_, ctx) => {
  const collection = await service.collection.getCollectionById(
    ctx.params.collectionId!,
    ctx.user.id
  )

  return NextResponse.json<GetData>({ collection })
})

export type PatchBody = Partial<CreateCollectionInput>
export type PatchData = { collection: CollectionWithMedia }
export const PATCH = authRouter(async (_, ctx) => {
  const collection = await service.collection.updateCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.body()
  )

  return NextResponse.json<PatchData>({ collection })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.collection.deleteCollection(
    ctx.params.collectionId!,
    ctx.user.id
  )

  return NextResponse.json(null)
})
