import db, { Media, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { mediaPermissionFactory } from './helpers'

export async function deleteMedia(
  user: PrettifyPick<User, 'id' | 'role'>,
  media: PrettifyPick<Media, 'id' | 'status' | 'authorId' | 'messageId'>
) {
  const permission = mediaPermissionFactory(media)
  if (!permission.delete(user)) {
    throw new ReqErr('You have no permission to delete this media')
  }

  await db.media.delete({ where: { id: media.id } })
}
