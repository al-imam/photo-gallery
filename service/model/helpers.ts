import { User } from '@prisma/client'
import { PrettifyPick } from '../utils'

export function userPermissionFactory<
  T extends PrettifyPick<User, 'id' | 'role'> | null,
>(user: T) {
  const isAdmin = Boolean(user && user.role === 'ADMIN')
  const isModerator = Boolean(user && user.role === 'MODERATOR')
  const isModeratorLevel = isAdmin || isModerator

  const isVerified = Boolean(user && user.role === 'VERIFIED')
  const isVerifiedLevel = isModeratorLevel || isVerified

  const isBanned = Boolean(user && user.role === 'BANNED')

  return {
    isAdmin,
    isModerator,
    isModeratorLevel,
    isVerified,
    isVerifiedLevel,
    isBanned,
  }
}
