import { onlyModerator } from '@/server/next/middlewares/auth'
import { sendMediaWithLoves } from '@/server/next/middlewares/media'
import { authRouter } from '@/server/next/router'

// TODO: Implement this route

export const GET = authRouter(
  onlyModerator,
  async (_, ctx, next) => {
    const { mediaId } = ctx.params
    return next(mediaId)
  },
  sendMediaWithLoves
)

export const POST = authRouter(
  onlyModerator,
  async (_, ctx, next) => {
    const { mediaId } = ctx.params
    return next(mediaId)
  },
  sendMediaWithLoves
)

export const DELETE = authRouter(
  onlyModerator,
  async (_, ctx, next) => {
    const { mediaId } = ctx.params
    return next(mediaId)
  },
  sendMediaWithLoves
)
