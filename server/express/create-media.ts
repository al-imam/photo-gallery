import { Response } from 'express'
import db from '../../service/db'
import { mediaInputSchema } from './config'
import discord from './discord'
import { UserRequest } from './middleware'

export default async function (req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new Error('No file provided')
  const body = mediaInputSchema.parse(req.body)

  const category = await db.mediaCategory.findUnique({
    where: { id: body.categoryId },
  })
  if (!category) throw new Error('Invalid category')

  if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
    body.status = 'APPROVED'
    body.status_moderatedById = req.user.id
  }

  const result = await discord.upload(buffer)
  const media = await db.media.create({
    data: {
      ...body,
      authorId: req.user.id,
      categoryId: category.id,
      messageId: result.id,
      size: result.media.size,
      url_media: result.media.url,
      url_thumbnail: result.thumbnail.url,
    },
  })

  res.json({ data: media })
}
