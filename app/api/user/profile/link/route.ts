import { authRouter } from '@/server/next/router'
import service from '@/service'
import { AddSocialLinkBody } from '@/service/model/profile'
import { ProfileLink } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PostBody = AddSocialLinkBody
export type PostData = { link: ProfileLink }
export const POST = authRouter(async (req, ctx) => {
  const link = await service.profile.addSocialLink(ctx.user.id, ctx.body())
  return NextResponse.json<PostData>({ link })
})
