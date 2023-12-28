import { User } from '@prisma/client'
import { PrettifyPick } from '../utils'

export function userPermissionFactory(
  user: PrettifyPick<User, 'id' | 'status'> | null
) {
  const isAdmin = Boolean(user && user.status === 'ADMIN')
  const isModerator = Boolean(user && user.status === 'MODERATOR')
  const isModeratorLevel = Boolean(isAdmin || isModerator)

  const isVerified = Boolean(user && user.status === 'VERIFIED')
  const isVerifiedLevel = Boolean(isModeratorLevel || isVerified)

  const isPublic = Boolean(user && user.status === 'PUBLIC')
  const isPublicLevel = Boolean(isVerifiedLevel || isPublic)

  const isBanned = Boolean(user && user.status === 'BANNED')

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
