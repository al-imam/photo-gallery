import { Profile } from '@prisma/client'
import { PrettifyPick } from '../utils'
import db from '../db'

export type UpdateProfileBody = PrettifyPick<Profile, never, 'bio' | 'location'>
export async function updateProfile(userId: string, body: UpdateProfileBody) {
  const profile = await db.profile.update({
    where: { id: userId },
    data: { bio: body.bio, location: body.location },
  })

  return profile
}
