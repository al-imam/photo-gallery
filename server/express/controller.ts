import { MAX_MEDIA_FILE_SIZE, MAX_AVATAR_FILE_SIZE_HUMAN } from './config'
import { UserRequest } from './middleware'
import ReqErr from '@/service/ReqError'
import { Response } from 'express'
import { putAvatar, uploadMedia } from './service'

export async function createMedia(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  if (req.file!.size > MAX_MEDIA_FILE_SIZE) {
    throw new ReqErr('Max file size is 25 MiB')
  }
  const data = await uploadMedia(req.user, buffer, req.body)
  res.json({ data })
}

export async function postAvatar(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  if (req.file!.size > MAX_AVATAR_FILE_SIZE_HUMAN) {
    throw new ReqErr('Max file size is 5 MiB')
  }

  const user = await putAvatar(req.user, buffer)
  res.json({ user })
}
