import r from 'rype'
import { ContentStatus, Media } from '@prisma/client'

export const mediaInputSchema = r.object({
  note: r.string().optional(),
  title: r.string().optional(),
  categoryId: r.string().optional(),
  newCategory: r.string().optional(),
  description: r.string().optional(),
  tags: r.array(r.string()).optional(),
  status: r.fixed('PENDING' as ContentStatus),
})

export const MAX_MEDIA_FILE_SIZE = 26214400 // 25 MiB
export const MAX_AVATAR_FILE_SIZE_HUMAN = 5242880 // 5 MiB

let a = {} as keyof r.inferOutput<typeof mediaInputSchema>
a satisfies keyof Media
