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
  const lowerName = formatCategoryName(name)
  return (
    (await db.mediaCategory.findFirst({ where: { name: lowerName } })) ??
    (await db.mediaCategory.create({ data: { name: lowerName } }))
  )
}

export async function editCategory(id: string, name: string) {
  return await db.mediaCategory.update({
    where: { id },
    data: { name: formatCategoryName(name) },
  })
}

export async function deleteCategory(id: string) {
  return await db.mediaCategory.delete({ where: { id } })
}

function formatCategoryName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '')
}
