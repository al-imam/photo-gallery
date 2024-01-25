// TODO: Implement media request model

import db, { User } from '@/service/db'
import { PrettifyPick } from '@/service/utils'
import { mediaPermissionFactory } from './helpers'
import ReqErr from '@/service/ReqError'

export async function getUpdateRequests() {}

export async function getMediaUpdateRequest(
  id: string,
  user?: PrettifyPick<User, 'id' | 'role'>
) {
  const media = await db.media.findUniqueOrThrow({
    where: { id },
  })

  if (!mediaPermissionFactory(media).view(user)) {
    throw new ReqErr('Permission denied to view update request')
  }

  return db.mediaUpdateRequest.findUnique({ where: { mediaId: id } })
}

export async function rejectUpdateRequest() {}

export async function approveUpdateRequest() {}
