import db from '../db'
import { paginationQueries, PaginationQueries } from '../helpers'

export type GetCategoryOptions = PaginationQueries &
  Partial<{
    search: string
  }>

export async function getCategoryList(options: GetCategoryOptions) {
  const categoryList = await db.mediaCategory.findMany({
    ...paginationQueries({
      orderByKey: 'createdAt',
      orderBy: 'desc',
      ...options,
    }),

    where: {
      name: { mode: 'insensitive', contains: options.search },
    },
  })

  return categoryList
}

export async function findOrCreateCategory(name: string) {
  const lowerName = name.toLowerCase()
  return (
    (await db.mediaCategory.findFirst({ where: { name: lowerName } })) ??
    (await db.mediaCategory.create({ data: { name: lowerName } }))
  )
}
