import { User } from '@prisma/client'
import { PrettifyPick } from '../utils'

export function userPermissionFactory(
  user: PrettifyPick<User, 'id' | 'role'> | null
) {
  const isAdmin = Boolean(user && user.role === 'ADMIN')
  const isModerator = Boolean(user && user.role === 'MODERATOR')
  const isModeratorLevel = Boolean(isAdmin || isModerator)

  const isVerified = Boolean(user && user.role === 'VERIFIED')
  const isVerifiedLevel = Boolean(isModeratorLevel || isVerified)

  const isPublic = Boolean(user && user.role === 'PUBLIC')
  const isPublicLevel = Boolean(isVerifiedLevel || isPublic)

  const isBanned = Boolean(user && user.role === 'BANNED')

  return {
    isAdmin,
    isModerator,
    isModeratorLevel,
    isVerified,
    isVerifiedLevel,
    isPublic,
    isPublicLevel,
    isBanned,
  }
}
