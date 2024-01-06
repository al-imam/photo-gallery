import { Profile, ProfileLink, User } from '@prisma/client'
import { PrettifyPick, pick } from '../utils'
import db from '../db'
import { jwt } from '../hash'
import mail from '../mail'
import ReqErr from '../ReqError'

export type PaginationQueries = Partial<{
  cursor: string
  limit: number | string
  skip: number | string
}>

export function paginationQueries<T>(
  options: PaginationQueries & {
    orderByKey: keyof T
    orderBy: 'asc' | 'desc'
  }
) {
  return {
    skip:
      typeof options.skip === 'string' ? parseInt(options.skip) : options.skip,

    take:
      typeof options.limit === 'string'
        ? parseInt(options.limit)
        : options.limit ?? 25,

    orderBy: { [options.orderByKey]: options.orderBy },
    ...(options.cursor
      ? { cursor: { id: options.cursor }, skip: 1 }
      : undefined),
  }
}

export type UpdateProfileBody = PrettifyPick<Profile, never, 'bio' | 'location'>
export async function updateProfile(userId: string, body: UpdateProfileBody) {
  const profile = await db.profile.update({
    where: { userId },
    data: { ...pick(body, 'bio', 'location') },
  })

  return profile
}

export async function requestPublicEmail(userId: string, email: string) {
  const token = await jwt.sign('public-email', {
    userId,
    profileEmail: email,
  })

  return mail.sendPublicEmailToken(email, token)
}

export async function confirmPublicEmail(token: string) {
  const { payload } = await jwt.verify('public-email', token)
  const profile = await db.profile.update({
    where: { userId: payload.userId },
    include: { links: true },
    data: { email: payload.profileEmail },
  })

  return profile
}

export type AddSocialLinkBody = PrettifyPick<ProfileLink, 'type' | 'url'>
export async function addSocialLink(userId: string, body: AddSocialLinkBody) {
  const existing = await db.profileLink.count({ where: { userId } })
  if (existing > 5) throw new ReqErr('You can only add up to 5 links.')

  const link = await db.profileLink.create({
    data: { userId, ...pick(body, 'type', 'url') },
  })

  return link
}

export type UpdateSocialLinkBody = Partial<AddSocialLinkBody>
export async function updateSocialLinks(
  userId: string,
  linkId: string,
  body: UpdateSocialLinkBody
) {
  const link = await db.profileLink.update({
    where: { id: linkId, userId },
    data: pick(body, 'type', 'url'),
  })

  if (!link) throw new ReqErr('Link not found.')

  return link
}

export async function removeSocialLink(userId: string, linkId: string) {
  const link = await db.profileLink.delete({
    where: { id: linkId, userId },
  })

  if (!link) throw new ReqErr('Link not found.')

  return link
}
