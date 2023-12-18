export function queryToNumber(query: unknown) {
  return typeof query === 'string' ? Number(query) : undefined
}
