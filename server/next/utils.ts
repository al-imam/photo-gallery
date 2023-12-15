export function queryToNumber(query: string) {
  return typeof query === 'string' ? Number(query) : undefined
}
