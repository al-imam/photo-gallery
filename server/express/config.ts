import r from 'rype'
import { ContentStatus } from '@prisma/client'

export const mediaInputSchema = r.object({
  note: r.string().optional(),
  title: r.string().optional(),
  categoryId: r.string().optional(),
  newCategory: r.string().optional(),
  description: r.string().optional(),
  tags: r.array(r.string()).optional(),

  status: r.fixed('PENDING' as ContentStatus),
  status_moderatedById: r.fixed(undefined as undefined | string),
  status_moderatedAt: r.fixed(undefined as undefined | Date),
  status_approvedAt: r.fixed(undefined as undefined | Date),
})
