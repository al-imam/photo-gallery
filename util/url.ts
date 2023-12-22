type Paths = string | number | null | undefined

export function joinUrl(...args: Paths[]) {
  return args
    .filter(Boolean)
    .map((url) => `${url}`.toString().replace(/^\/|\/$/g, ''))
    .filter(Boolean)
    .join('/')
}
