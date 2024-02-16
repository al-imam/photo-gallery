import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/router'
import { onlyModerator } from '@/server/middlewares/auth'

export const POST = authRouter(onlyModerator, async (_, ctx, next) => {
  const media = await service.media.approveUpdateRequest(
    ctx.params.mediaId!,
    ctx.user.id
  )
  return NextResponse.json({ media })
})
