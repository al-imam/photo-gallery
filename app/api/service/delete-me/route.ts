import { serviceUserRouter } from '@/server/router'
import { NextResponse } from 'next/server'
import service from '@/service'
import { checkPassword } from '@/server/middlewares/auth'

export const POST = serviceUserRouter(checkPassword, async (_, ctx) => {
  const user = await service.user.remove(ctx.user)
  return NextResponse.json({ storageRecordId: user.avatar_storageRecordId })
})
