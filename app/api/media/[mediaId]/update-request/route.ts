import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/router'

export const GET = authRouter(async (_, ctx) => {
  const { mediaId } = ctx.params
  const request = await service.media.getMediaUpdateRequest(mediaId!, ctx.user)
  return NextResponse.json({ request })
})
