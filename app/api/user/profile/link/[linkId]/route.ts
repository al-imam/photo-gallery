import { authRouter } from '@/server/next/router'
import service from '@/service'
import { UpdateSocialLinkBody } from '@/service/model/profile'
import { ProfileLink } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PatchBody = UpdateSocialLinkBody
export type PatchData = { link: ProfileLink }
export const PATCH = authRouter(async (_, ctx) => {
  const link = await service.profile.updateSocialLinks(
    ctx.user.id,
    ctx.params.linkId!,
    ctx.body()
  )

  return NextResponse.json<PatchData>({ link })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.profile.removeSocialLink(ctx.user.id, ctx.params.linkId!)
  return NextResponse.json(null)
})
