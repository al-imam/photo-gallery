import { router } from '@/server/router'
import service from '@/service'
import config from '@/service/config'
import { pick } from '@/service/utils'
import { Profile, ProfileLink, User } from '@prisma/client'
import { NextResponse } from 'next/server'

export type GetBody = {
  user: Pick<User, (typeof config.user.publicFields)[number]>
  profile: Profile & { links: ProfileLink[] }
}
export const GET = router(async (_, ctx) => {
  const id = ctx.params.userId!
  const user = await service.user.fetchById(id)
  const profile = await service.profile.getUserProfile(user.id)
  return NextResponse.json<GetBody>({
    user: pick(user, ...config.user.publicFields),
    profile: profile!,
  })
})
