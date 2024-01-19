import { authRouter } from '@/server/next/router'
import service from '@/service'
import { CreateCollectionInput } from '@/service/model/collection/helpers'
import { NextResponse } from 'next/server'

export const GET = authRouter(async (_, ctx) => {
  const collection = await service.collection.getCollectionById(
    ctx.params.collectionId!,
    ctx.user.id
  )

  return NextResponse.json({ collection })
})

export type PatchBody = Partial<CreateCollectionInput>
export const PATCH = authRouter(async (_, ctx) => {
  const collection = await service.collection.updateCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.body()
  )

  return NextResponse.json({ collection })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.collection.deleteCollection(
    ctx.params.collectionId!,
    ctx.user.id
  )

  return NextResponse.json(null)
})
