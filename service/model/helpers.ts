import { User } from '@prisma/client'
import { PrettifyPick } from '../utils'

export function userPermissionFactory<
  T extends PrettifyPick<User, 'id' | 'role', 'isVerified'> | null,
>(user: T) {
  const isAdmin = Boolean(user && user.role === 'ADMIN')
  const isModerator = Boolean(user && user.role === 'MODERATOR')
  const isModeratorLevel = Boolean(isAdmin || isModerator)

  const isVerified = (user && user.isVerified) as T extends {
    isVerified: boolean
  }
    ? T['isVerified']
    : never

  const isBanned = Boolean(user && user.role === 'BANNED')

  return {
    isAdmin,
    isModerator,
    isModeratorLevel,
    isVerified,
    isBanned,
  }
}
