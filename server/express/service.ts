import { Media, User } from '@prisma/client'
import { mediaInputSchema } from './config'
import ReqErr from '@/service/ReqError'
import { checkIfCategoryExists } from '@/service/model/media/helpers'
import db from '@/service/db'
import discord from '@/service/discord'
import { MEDIA_INCLUDE_QUERY, USER_SAFE_FIELDS_QUERY } from '@/service/config'
import { MediaWithLoves } from '@/service/types'

export async function uploadMedia(
  user: Pick<User, 'id' | 'status'>,
  buffer: Buffer,
  reqBody: Partial<Media>
) {
  const body = mediaInputSchema.parse(reqBody)
  if (body.newCategory && body.categoryId) {
    throw new ReqErr('Cannot provide both newCategory and categoryId')
  }
  if (body.categoryId) {
    await checkIfCategoryExists(body.categoryId)
  }

  if (
    user.status === 'VERIFIED' ||
    user.status === 'MODERATOR' ||
    user.status === 'ADMIN'
  ) {
    if (body.newCategory) {
      const name = body.newCategory.toLowerCase()
      const category =
        (await db.mediaCategory.findFirst({ where: { name } })) ??
        (await db.mediaCategory.create({ data: { name } }))

      body.categoryId = category.id
    }

    body.status = 'APPROVED'
    delete body.newCategory
    delete body.note
  }

  const result = await discord.uploadMedia(buffer)
  const media = await db.media.create({
    data: {
      ...body,

      authorId: user.id,
      messageId: result.id,

      media_size: result.media.size,
      media_width: result.media.width,
      media_height: result.media.height,

      url_media: result.media.url,
      url_thumbnail: result.thumbnail.url,
    },
    include: MEDIA_INCLUDE_QUERY,
  })

  return {
    ...media,
    isLoved: false,
    loves: 0,
    messageId: undefined as never,
  } as MediaWithLoves
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
