import db, { Media, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { mediaPermissionFactory } from './helpers'
import ReqErr from '@/service/ReqError'

export * from './get'
export * from './modify'

export async function createLove(userId: string, mediaId: string) {
  return db.mediaReaction.create({
    data: {
      mediaId,
      userId,
    },
  })
}

export async function removeLove(userId: string, mediaId: string) {
  return db.mediaReaction.delete({
    where: { mediaId_userId: { mediaId, userId } },
  })
}

export async function deleteMedia(
  user: PrettifyPick<User, 'id' | 'status'>,
  media: PrettifyPick<Media, 'id' | 'status' | 'authorId'>
) {
  const permission = mediaPermissionFactory(media)
  if (!permission.delete(user)) {
    throw new ReqErr('You have no permission to delete this media')
  }

  return db.media.delete({ where: { id: media.id } })
}
