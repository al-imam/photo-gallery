type Paths = string | number | null | undefined

export function joinUrl(...args: Paths[]) {
  return args
    .filter(Boolean)
    .map((url) => `${url}`.toString().replace(/^\/|\/$/g, ''))
    .filter(Boolean)
    .join('/')
}

export function getStorageUrl(folder: 'media' | 'avatar', url: string) {
  return joinUrl('https://storage.palestinian.top', `/${folder}/`, url)
}

export function getMediaUrl(url: string) {
  return getStorageUrl('media', url)
}

export function getAvatarUrl(url: string) {
  return getStorageUrl('avatar', url)
}
