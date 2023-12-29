import db, { Media, User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { mediaInputSchema, mediaPermissionFactory } from './helpers'
import ReqErr from '@/service/ReqError'
import discordNext from '@/service/discord-next'
import { MEDIA_INCLUDE_QUERY } from '@/service/config'
import { DiscordMediaUploadResult, MediaWithLoves } from '@/service/types'
import r from 'rype'

export * from './get'
export * from './love'
export * from './modify'
export * from './report'

export function createMediaFactory(
  mediaBody: r.inferInput<typeof mediaInputSchema>
) {
  const body = mediaInputSchema.parse(mediaBody)
  if (body.newCategory && body.categoryId) {
    throw new ReqErr('Cannot provide both newCategory and categoryId')
  }

  return async function createMedia(
    user: Pick<User, 'id' | 'status'>,
    discord: DiscordMediaUploadResult
  ) {
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

    const media = await db.media.create({
      data: {
        ...body,

        authorId: user.id,
        messageId: discord.id,

        media_size: discord.media.size,
        media_width: discord.media.width,
        media_height: discord.media.height,

        url_media: discord.media.url,
        url_thumbnail: discord.thumbnail.url,
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
}

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
