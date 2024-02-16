import {
  setMedia,
  sendMediaWithLoves,
  SendMediaWithLovesData,
} from '@/server/middlewares/media'
import service from '@/service'
import { authRouter } from '@/server/router'
import { onlyModerator } from '@/server/middlewares/auth'
import { ModerateMediaBody } from '@/service/model/media'

export type GetData = Omit<SendMediaWithLovesData, 'relatedMedia'>
export const GET = authRouter(onlyModerator, setMedia, sendMediaWithLoves)

export type PatchBody = ModerateMediaBody
export type PatchData = {
  media: Awaited<ReturnType<typeof service.media.moderateMedia>>
}
export const PATCH = authRouter(
  onlyModerator,
  setMedia,
  async (_, ctx, next) => {
    ctx.media = await service.media.moderateMedia(
      ctx.user.id,
      ctx.media,
      ctx.body<PatchBody>()
    )

    return next()
  },
  sendMediaWithLoves
)
