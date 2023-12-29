import { authRouter, router } from '@/server/next/router'
import service from '@/service'
import { Profile } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PostBody = { email: string }
export type PostData = { message: string }
export const POST = authRouter(async (req, ctx) => {
  const { email } = await req.json<PostBody>()
  await service.profile.requestPublicEmail(ctx.user.id, email)
  return NextResponse.json<PostData>({ message: 'Email sent' })
})

export type PatchBody = { token: string }
export type PatchData = { profile: Profile }
export const PATCH = router(async (_, ctx) => {
  const body = ctx.body<PatchBody>()
  const profile = await service.profile.confirmPublicEmail(body.token)
  return NextResponse.json<PatchData>({ profile })
})
