export function convertTimeSpan(timeSpan: number): string {
  const seconds = Math.floor(timeSpan / 1000) % 60
  const minutes = Math.floor(timeSpan / (1000 * 60)) % 60
  const hours = Math.floor(timeSpan / (1000 * 60 * 60)) % 24
  const days = Math.floor(timeSpan / (1000 * 60 * 60 * 24)) % 30
  const months = Math.floor(timeSpan / (1000 * 60 * 60 * 24 * 30))

  let result: string[] = []
  if (months > 0) {
    result.push(`${months} month${months > 1 ? 's' : ''}`)
  }
  if (days > 0) {
    result.push(`${days} day${days > 1 ? 's' : ''}`)
  }
  if (hours > 0) {
    result.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  }
  if (seconds > 0) {
    result.push(`${seconds} second${seconds > 1 ? 's' : ''}`)
  }

  return result.join(', ')
}
