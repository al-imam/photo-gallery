import { MediaStatus } from '@prisma/client'
import r from 'rype'

const mediaStatus = ['PENDING', 'APPROVED', 'REJECTED', 'PASSED_TO_ADMIN'] as [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PASSED_TO_ADMIN',
]
mediaStatus satisfies MediaStatus[]

export const mediaInputSchema = r.object({
  authorId: r.string(),
  categoryId: r.string(),
  status_moderatedById: r.fixed(undefined as undefined | string),
  title: r.string().optional(),
  description: r.string().optional(),
  tags: r.array(r.string()).optional(),
  status: r.string(...mediaStatus).optional(),
})
