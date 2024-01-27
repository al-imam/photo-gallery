import { authRouter } from '@/server/router'
import service from '@/service'
import { CollectionWithMedia } from '@/service/types'
import { NextResponse } from 'next/server'

export type PostBody = { mediaId: string }
export type PostData = { collection: CollectionWithMedia }
export const POST = authRouter(async (_, ctx) => {
  const collection = await service.collection.addMediaToCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.params.mediaId!
  )

  return NextResponse.json<PostData>({ collection })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.collection.removeMediaFromCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.params.mediaId!
  )

  return NextResponse.json(null)
})
