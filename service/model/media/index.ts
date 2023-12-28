import db, { Media, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { mediaPermissionFactory } from './helpers'
import ReqErr from '@/service/ReqError'
import discordNext from '@/service/discord-next'

export * from './get'
export * from './love'
export * from './modify'
export * from './report'

export async function deleteMedia(
  user: PrettifyPick<User, 'id' | 'status'>,
  media: PrettifyPick<Media, 'id' | 'status' | 'authorId' | 'messageId'>
) {
  const permission = mediaPermissionFactory(media)
  if (!permission.delete(user)) {
    throw new ReqErr('You have no permission to delete this media')
  }

  await db.media.delete({ where: { id: media.id } })
  await discordNext.deleteMedia(media.messageId)
}
