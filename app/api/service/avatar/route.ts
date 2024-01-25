import { serviceUserRouter } from '@/server/router'
import { UpdateAvatarBody } from '@/service/model/user'
import { NextResponse } from 'next/server'
import service from '@/service'

export type PostBody = UpdateAvatarBody
export const POST = serviceUserRouter(async (_, ctx) => {
  const user = await service.user.updateAvatar(
    ctx.user.id,
    ctx.body<PostBody>()
  )
  return NextResponse.json({ user })
})
