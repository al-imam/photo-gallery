import { SendMediaWithLovesData, sendMediaWithLoves, setMedia } from '@/server/next/middlewares/media'
import { authRouter } from '@/server/next/router'
import service from '@/service'

export type PostData = SendMediaWithLovesData
export const POST = authRouter(
  setMedia,
  async (_, ctx, next) => {
    await service.media.createLove(ctx.user.id, ctx.media.id)
    return next()
  },
  sendMediaWithLoves
)

export type DeleteData = SendMediaWithLovesData
export const DELETE = authRouter(
  setMedia,
  async (_, ctx, next) => {
    await service.media.removeLove(ctx.user.id, ctx.media.id)
    return next()
  },
  sendMediaWithLoves
)
