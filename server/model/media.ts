import r from 'rype'
import db, { MediaStatus } from '../db'
import discord from '../discord'

const mediaStatus = ['PENDING', 'APPROVED', 'REJECTED', 'PASSED_TO_ADMIN'] as [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PASSED_TO_ADMIN',
]
mediaStatus satisfies MediaStatus[]

const mediaInput = r.object({
  authorId: r.string(),
  title: r.string().optional(),
  description: r.string().optional(),
  tags: r.array(r.string()).optional(),
  status: r.string(...mediaStatus).optional(),
  status_moderatedById: r.string().optional(),
})

export async function create(
  image: Buffer,
  data: r.inferInput<typeof mediaInput>
) {
  const body = mediaInput.parse(data)
  const result = await discord.upload(image)
  const newMedia = await db.media.create({
    data: {
      ...body,
      messageId: result.id,
      size: result.media.size,
      url_media: result.media.url,
      url_thumbnail: result.thumbnail.url,
    },
  })

  return newMedia
}
