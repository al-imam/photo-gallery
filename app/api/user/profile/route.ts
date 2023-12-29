import service from '@/service'
import { NextResponse } from 'next/server'
import { authRouter } from '@/server/next/router'
import { UpdateProfileBody } from '@/service/model/profile'

export type PatchBody = UpdateProfileBody
export type PatchData = { profile: UpdateProfileBody }
export const PATCH = authRouter(async (req, ctx) => {
  const profile = await service.profile.updateProfile(
    ctx.user.id,
    ctx.body()
  )

  return NextResponse.json<PatchData>({ profile })
})
