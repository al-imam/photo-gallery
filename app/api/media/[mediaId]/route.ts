import {
  setMedia,
  sendMediaWithLoves,
  SendMediaWithLovesData,
} from '@/server/middlewares/media'
import { authRouter, optionalAuthRouter } from '@/server/router'
import service from '@/service'
import { UpdateMediaBody } from '@/service/model/media'
import { queryToNumber } from '@/service/utils'

export type GetQuery = { limit: string }
export type GetData = SendMediaWithLovesData
export const GET = optionalAuthRouter(
  setMedia,
  async (_, ctx, next) => {
    ctx.relatedMedia = await service.media.getRelatedMedia(
      ctx.media,
      queryToNumber(ctx.query<GetQuery>().limit)
    )
    return next()
  },
  sendMediaWithLoves
)

export type PatchBody = UpdateMediaBody
export type PatchData = SendMediaWithLovesData
export const PATCH = authRouter(
  setMedia,
  async (_, ctx, next) => {
    const media = await service.media.updateMedia(
      ctx.user,
      ctx.media,
      ctx.body<PatchBody>()
    )

    ctx.media = media
    return next()
  },
  sendMediaWithLoves
)
