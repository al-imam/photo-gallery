import {
  setMedia,
  sendMediaWithLoves,
  SendMediaWithLovesData,
} from '@/server/middlewares/media'
import service from '@/service'
import { queryToNumber } from '@/service/utils'
import { MediaUpdateRequest } from '@prisma/client'
import { UpdateMediaBody } from '@/service/model/media'
import { authRouter, optionalAuthRouter } from '@/server/router'

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
export type PatchData = SendMediaWithLovesData &
  (
    | {
        updated: true
      }
    | {
        updated: false
        request: MediaUpdateRequest
      }
  )

export const PATCH = authRouter(
  setMedia,
  async (_, ctx, next) => {
    const result = await service.media.updateMedia(
      ctx.user,
      ctx.media,
      ctx.body<PatchBody>()
    )

    if ('id' in result) {
      ctx.media = result
      ctx.extra = { updated: true }
    } else {
      ctx.extra = { updated: false, request: result }
    }

    return next()
  },
  sendMediaWithLoves
)
