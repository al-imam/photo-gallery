import { authRouter, router } from '@/server/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import { Profile, ProfileLink } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PostBody = { newEmail: string }
export type PostData = { message: string }
export const POST = authRouter(async (_, ctx) => {
  const { newEmail } = ctx.body<PostBody>()
  if (!newEmail) throw new ReqErr('Invalid email')
  await service.profile.requestPublicEmail(ctx.user.id, newEmail)
  return NextResponse.json<PostData>({ message: 'Email sent' })
})

export type PatchBody = { token: string }
export type PatchData = {
  profile: Profile & { links: ProfileLink[] }
}
export const PATCH = router(async (_, ctx) => {
  const body = ctx.body<PatchBody>()
  const profile = await service.profile.confirmPublicEmail(body.token)
  return NextResponse.json<PatchData>({ profile })
})
