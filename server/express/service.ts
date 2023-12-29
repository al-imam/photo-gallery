import r from 'rype'
import { User } from '@prisma/client'
import db from '@/service/db'
import discord from '@/service/discord'
import { USER_SAFE_FIELDS_QUERY } from '@/service/config'
import { createMediaFactory } from '@/service/model/media'
import { mediaInputSchema } from '@/service/model/media/helpers'

export async function uploadMedia(
  user: Pick<User, 'id' | 'status'>,
  buffer: Buffer,
  reqBody: r.inferInput<typeof mediaInputSchema>
) {
  return createMediaFactory(reqBody)(user, await discord.uploadMedia(buffer))
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
