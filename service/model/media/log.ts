import ReqErr from '@/service/ReqError'
import db from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { Media, User } from '@prisma/client'
import config from '@/service/config'
import { userPermissionFactory } from '../helpers'

export async function getMessages(
  user: PrettifyPick<User, 'id' | 'role'>,
  media: PrettifyPick<Media, 'id' | 'authorId'>
) {
  if (
    user.id !== media.authorId &&
    !userPermissionFactory(user).isModeratorLevel
  ) {
    throw new ReqErr('You cannot view the messages of this media')
  }

  return db.lOG_MediaChange.findMany({
    where: { mediaId: media.id },
    include: { user: { select: config.user.selectPublicFields } },
  })
}

export async function createMessage(
  user: PrettifyPick<User, 'id' | 'role'>,
  media: PrettifyPick<Media, 'id' | 'authorId' | 'status'>,
  message: string
) {
  if (
    user.id !== media.authorId &&
    !userPermissionFactory(user).isModeratorLevel
  ) {
    throw new ReqErr('You cannot message this media', 403)
  }

  if (media.status === 'APPROVED') {
    throw new ReqErr('Cannot message approved media', 400)
  }

  return db.lOG_MediaChange.create({
    data: {
      userId: user.id,
      mediaId: media.id,
      message,
    },

    include: { user: { select: config.user.selectPublicFields } },
  })
}
