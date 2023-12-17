import {
  checkPassword,
  SendUserAndToken,
  sendUserAndToken,
} from '/server/next/middlewares/auth'
import service from '/service'
import ReqErr from '/service/ReqError'
import { authRouter } from '/server/next/router'

export type PATCHBody = SendUserAndToken
export const PATCH = authRouter(
  checkPassword,
  async (_, ctx, next) => {
    const { newPassword } = ctx.data
    if (!newPassword) throw new ReqErr('New password is required')
    ctx.user = await service.user.changePassword(ctx.user.id, newPassword)
    return next()
  },
  sendUserAndToken
)
