export function random(min = 0, max = 100): number {
  if (min > max) {
    throw new Error('Minimum value cannot be greater than the maximum value.')
  }

  return Math.floor(Math.random() * (max - min) + min) + 1
}
