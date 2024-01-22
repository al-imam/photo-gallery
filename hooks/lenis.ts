import { ScrollContext } from '@/context/scroll-provider'
import { useContext } from 'react'

export function useLenis() {
  const value = useContext(ScrollContext)
  if (value) return value
  throw new Error('useLenis must be used within an ScrollProvider')
}
