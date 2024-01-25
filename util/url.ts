type Paths = string | number | null | undefined

export function joinUrl(...args: Paths[]) {
  return args
    .filter(Boolean)
    .map((url, index) => {
      const path = `${url}`
      if (index === 0)
        return path.replace(/\/{1,}$/g, '').replace(/^\/{2,}/g, '/')
      return path.replace(/^\/{1,}|\/{1,}$/g, '')
    })
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
