import { authRouter } from '@/server/next/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export type PostBody = { mediaId: string }
export const POST = authRouter(async (_, ctx) => {
  const collection = await service.collection.addMediaToCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.body<PostBody>().mediaId
  )

  return NextResponse.json({ collection })
})

export type DeleteBody = { mediaId: string }
export const DELETE = authRouter(async (_, ctx) => {
  const collection = await service.collection.removeMediaFromCollection(
    ctx.params.collectionId!,
    ctx.user.id,
    ctx.body<DeleteBody>().mediaId
  )

  return NextResponse.json({ collection })
})
