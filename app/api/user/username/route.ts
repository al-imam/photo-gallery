import {
  checkPassword,
  SendUserAndToken,
  sendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import ReqErr from '/service/ReqError'
import { authRouter } from '/server/next/router'

export type PostBody = { newUsername: string; password: string }
export type PatchData = SendUserAndToken
export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    const { newUsername } = ctx.data as PostBody
    if (!newUsername) throw new ReqErr('New username is required')
    ctx.user = await service.user.changeUsername(ctx.user.id, newUsername)
    return next()
  },
  sendUserAndToken
)
