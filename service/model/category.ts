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

export async function createCategory(name: string) {
  if (!name.trim()) {
    throw new Error('Invalid category name')
  }
  return db.mediaCategory.create({ data: { name: name.trim() } })
}

export async function editCategory(id: string, name: string) {
  if (!name.trim()) {
    throw new Error('Invalid category name')
  }

  return await db.mediaCategory.update({
    where: { id },
    data: { name: name.trim() },
  })
}

export async function deleteCategory(id: string) {
  return await db.mediaCategory.delete({ where: { id } })
}
