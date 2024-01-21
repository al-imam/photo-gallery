import ReqErr from '@/service/ReqError'
import { Response } from 'express'
import service from '@/service'
import discord from '@/service/discord'
import { addLovesToMedia } from '@/service/model/media/helpers'
import db from '@/service/db'
import { USER_SAFE_FIELDS_QUERY } from '@/service/config'
import { UserRequest } from './middleware'
import { MAX_MEDIA_FILE_SIZE, MAX_AVATAR_FILE_SIZE_HUMAN } from './config'

export async function createMedia(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  if (req.file!.size > MAX_MEDIA_FILE_SIZE) {
    throw new ReqErr('Max file size is 25 MiB')
  }

  const mediaList = await service.media.createMedia(
    req.user,
    req.body,
    () => discord.uploadMedia(buffer),
    (result) => discord.deleteMedia(result.id)
  )

  const media = await addLovesToMedia(mediaList)
  res.json({ media })
}

export async function deleteMedia(req: UserRequest, res: Response) {
  const media = await service.media.getMedia(req.params.id, req.user)
  await service.media.deleteMedia(req.user, media)
  await discord.deleteMedia(media.messageId)
  res.json(null)
}

export async function postAvatar(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  if (req.file!.size > MAX_AVATAR_FILE_SIZE_HUMAN) {
    throw new ReqErr('Max file size is 5 MiB')
  }

  const result = await discord.uploadAvatar(buffer)
  const newUser = await db.user.update({
    where: { id: req.user.id },
    data: {
      avatar_messageId: result.id,
      avatar_sm: result.avatar_sm.url,
      avatar_md: result.avatar_md.url,
      avatar_lg: result.avatar_lg.url,
    },
    select: USER_SAFE_FIELDS_QUERY,
  })

  if (req.user.avatar_messageId) {
    await discord.deleteAvatar(req.user.avatar_messageId)
  }

  res.json({ user: newUser })
}

export async function deleteAvatar(req: UserRequest, res: Response) {
  if (!req.user.avatar_messageId) throw new ReqErr('No avatar set')
  const user = await db.user.update({
    where: { id: req.user.id },
    data: {
      avatar_messageId: null,
      avatar_sm: null,
      avatar_md: null,
      avatar_lg: null,
    },
    select: USER_SAFE_FIELDS_QUERY,
  })

  if (req.user.avatar_messageId) {
    await discord.deleteAvatar(req.user.avatar_messageId)
  }

  res.json({ user })
}
