import { MediaStatus } from '@prisma/client'
import r from 'rype'

export const mediaInputSchema = r.object({
  authorId: r.string(),
  categoryId: r.string(),
  title: r.string().optional(),
  description: r.string().optional(),
  tags: r.array(r.string()).optional(),

  status: r.fixed('PENDING' as MediaStatus),
  status_moderatedById: r.fixed(undefined as undefined | string),
})
