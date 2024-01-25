export type PaginationQueries = Partial<{
  cursor: string
  limit: number | string
  skip: number | string
}>

export function paginationQueries<T>(
  options: PaginationQueries & {
    orderByKey: keyof T
    orderBy: 'asc' | 'desc'
  }
) {
  return {
    skip:
      typeof options.skip === 'string' ? parseInt(options.skip) : options.skip,

    take:
      typeof options.limit === 'string'
        ? parseInt(options.limit)
        : options.limit ?? 25,

    orderBy: { [options.orderByKey]: options.orderBy },
    ...(options.cursor
      ? { cursor: { id: options.cursor }, skip: 1 }
      : undefined),
  }
}
