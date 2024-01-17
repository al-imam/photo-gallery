import {
  setMedia,
  sendMediaWithLoves,
  SendMediaWithLovesData,
} from '@/server/next/middlewares/media'
import { authRouter, optionalAuthRouter } from '@/server/next/router'
import { queryToNumber } from '@/server/next/utils'
import service from '@/service'
import { UpdateMediaBody } from '@/service/model/media'

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
