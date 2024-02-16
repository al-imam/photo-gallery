import service from '@/service'
import ReqErr from '@/service/ReqError'
import { addLovesToMedia } from '@/service/model/media/helpers'
import { MediaWithLoves, NextUserMediaHandler } from '@/service/types'
import { NextResponse } from 'next/server'

export const setMedia: NextUserMediaHandler = async (_, ctx, next) => {
  const { mediaId } = ctx.params
  if (!mediaId) throw new ReqErr('Media id is required')
  ctx.media = await service.media.getMedia(mediaId, ctx.user)
  return next()
}

export type SendMediaWithLovesData = {
  media: MediaWithLoves
  relatedMedia?: MediaWithLoves[]
}

export const sendMediaWithLoves: NextUserMediaHandler<{
  extra?: Record<string, any>
}> = async (_, ctx) => {
  const media = await addLovesToMedia(ctx.media, ctx.user?.id)
  const relatedMedia =
    ctx.relatedMedia && (await addLovesToMedia(ctx.relatedMedia, ctx.user?.id))

  return NextResponse.json<SendMediaWithLovesData>({
    media,
    relatedMedia,
    ...ctx.extra,
  })
}
