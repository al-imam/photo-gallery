import { Response } from 'express'
import db from '../../service/db'
import { mediaInputSchema } from './config'
import { UserRequest } from './middleware'
import { USER_PUBLIC_FIELDS_QUERY } from '../../service/config'
import { MediaWithLoves } from '../../service/types'
import discord from './discord'

export default async function (req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new Error('No file provided')
  const body = mediaInputSchema.parse(req.body)
  if (body.newCategory && body.categoryId) {
    throw new Error('Cannot provide both newCategory and categoryId')
  }

  if (body.categoryId) {
    await db.mediaCategory.findUniqueOrThrow({
      where: { id: body.categoryId },
    })
  }

  if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
    if (body.newCategory) {
      const name = body.newCategory.toLowerCase()
      const category =
        (await db.mediaCategory.findFirst({ where: { name } })) ??
        (await db.mediaCategory.create({ data: { name } }))

      body.categoryId = category.id
    }

    body.status = 'APPROVED'
    body.status_approvedAt = new Date()
    body.status_moderatedAt = new Date()
    body.status_moderatedById = req.user.id
    delete body.newCategory
    delete body.note
  }

  const result = await discord.upload(buffer)
  const media = await db.media.create({
    data: {
      ...body,

      authorId: req.user.id,
      messageId: result.id,

      media_size: result.media.size,
      media_width: result.media.width,
      media_height: result.media.height,

      url_media: result.media.url,
      url_thumbnail: result.thumbnail.url,
    },
    include: {
      author: { select: USER_PUBLIC_FIELDS_QUERY },
      category: true,
    },
  })

  const data: MediaWithLoves = { ...media, isLoved: false, loves: 0 }
  res.json({ data })
}
