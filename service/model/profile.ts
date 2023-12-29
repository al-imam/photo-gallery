import { Profile } from '@prisma/client'
import { PrettifyPick, pick } from '../utils'
import db from '../db'
import { jwt } from '../hash'
import mail from '../mail'

export type UpdateProfileBody = PrettifyPick<Profile, never, 'bio' | 'location'>
export async function updateProfile(userId: string, body: UpdateProfileBody) {
  const profile = await db.profile.update({
    where: { id: userId },
    data: { ...pick(body, 'bio', 'location') },
  })

  return profile
}

export async function requestPublicEmail(userId: string, email: string) {
  const token = await jwt.sign('public-email', {
    userId,
    publicEmail: email,
  })

  return mail.sendPublicEmailToken(email, token)
}

export async function confirmPublicEmail(token: string) {
  const { payload } = await jwt.verify('public-email', token)
  const profile = await db.profile.update({
    where: { id: payload.userId },
    data: { public_email: payload.publicEmail },
  })

  return profile
}
