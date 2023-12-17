import {
  checkPassword,
  SendUserAndToken,
  sendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import ReqErr from '/service/ReqError'
import { authRouter } from '/server/next/router'

export type PatchBody = { newPassword: string; password: string }
export type PatchData = SendUserAndToken
export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    const { newPassword } = ctx.data as PatchBody
    if (!newPassword) throw new ReqErr('New password is required')
    ctx.user = await service.user.changePassword(ctx.user.id, newPassword)
    return next()
  },
  sendUserAndToken
)
