import { onlyModerator } from '@/server/middlewares/auth'
import { sendMediaWithLoves, setMedia } from '@/server/middlewares/media'
import { authRouter } from '@/server/router'
import service from '@/service'

export const GET = authRouter(onlyModerator, setMedia, sendMediaWithLoves)

export const PATCH = authRouter(
  onlyModerator,
  setMedia,
  async (_, ctx, next) => {
    ctx.media = await service.media.moderateMedia(
      ctx.user.id,
      ctx.media,
      ctx.body()
    )

    return next()
  },
  sendMediaWithLoves
)
