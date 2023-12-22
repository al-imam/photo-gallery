export async function getImages(length: number) {
  const promises = new Array(length)
    .fill(0)
    .map(() => fetch('https://source.unsplash.com/random/?palestine'))

  const responses = await Promise.all(promises)
  const buffers = await Promise.all(responses.map((res) => res.arrayBuffer()))
  return buffers.map((buffer) => Buffer.from(buffer))
}

export function getRandomItems<T extends any[], N extends number>(
  array: T,
  n: N
): T & { length: N } {
  const copyArray = array.slice()

  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copyArray[i]
    copyArray[i] = copyArray[j]
    copyArray[j] = temp
  }

  return copyArray.slice(0, n) as any
}
