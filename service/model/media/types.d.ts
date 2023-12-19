import { Media } from '@prisma/client'
import { PrettifyPick } from '@/service/utils'

export type UpdateMediaBody = PrettifyPick<
  Media,
  | 'title'
  | 'description'
  | 'note'
  | 'media_hasGraphicContent'
  | 'newCategory'
  | 'tags'
  | 'categoryId'
>

export type FeaturedMediaOptions = {
  cursor?: string
  limit?: number
  category?: string
  authorId?: string
}
