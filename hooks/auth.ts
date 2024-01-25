import { useContext } from 'react'
import { AuthContext } from '@/context/auth-provider'

export function useAuth() {
  const value = useContext(AuthContext)
  if (value) return value
  throw new Error('useAuth must be used within an AuthProvider')
}
