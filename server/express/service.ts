import { User } from '@prisma/client'
import db from '@/service/db'
import discord from '@/service/discord'
import { USER_SAFE_FIELDS_QUERY } from '@/service/config'
import { CreateMediaBody } from '@/service/model/media'
import service from '@/service'
import { addLovesToMedia } from '@/service/model/media/helpers'

export async function uploadMedia(
  user: Pick<User, 'id' | 'role'>,
  buffer: Buffer,
  body: CreateMediaBody
) {
  const mediaList = await service.media.createMedia(
    user,
    body,
    () => discord.uploadMedia(buffer),
    (result) => discord.deleteMedia(result.id)
  )

  return addLovesToMedia(mediaList)
}

export async function putAvatar(
  user: Pick<User, 'id' | 'avatar_messageId'>,
  buffer: Buffer
) {
  const result = await discord.uploadAvatar(buffer)
  const newUser = await db.user.update({
    where: { id: user.id },
    data: {
      avatar_messageId: result.id,
      avatar_sm: result.avatar_sm.url,
      avatar_md: result.avatar_md.url,
      avatar_lg: result.avatar_lg.url,
    },
    select: USER_SAFE_FIELDS_QUERY,
  })

  if (user.avatar_messageId) {
    discord.deleteAvatar(user.avatar_messageId).catch(console.error)
  }

  return newUser
}
