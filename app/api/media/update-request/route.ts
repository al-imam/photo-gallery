import { authRouter } from '@/server/router'
import { onlyModerator } from '@/server/middlewares/auth'
import service from '@/service'
import { NextResponse } from 'next/server'

export const GET = authRouter(onlyModerator, async (_, ctx, next) => {
  const requests = await service.media.getUpdateRequests()
  return NextResponse.json({ requests })
})
