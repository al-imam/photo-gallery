export function debounce(func: (...args: any[]) => any, wait: number) {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => func(...args), wait)
  }
}
