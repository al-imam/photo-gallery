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
