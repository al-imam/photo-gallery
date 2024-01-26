import { NextResponse } from 'next/server'
import service from '@/service'
import { authRouter } from '@/server/router'
import { MediaListOptions } from '@/service/model/media'
import { addLovesToMedia } from '@/service/model/media/helpers'
import { MediaWithLoves } from '@/service/types'

export type GetQuery = Partial<
  Record<keyof MediaListOptions, string> & Pick<MediaListOptions, 'status'>
>

export type GetData = {
  mediaList: MediaWithLoves[]
}

export const GET = authRouter(async (_, ctx) => {
  const query = ctx.query<GetQuery>()
  const mediaList = await service.media.getLatestMediaList({
    ...query,
    authorId: ctx.user.id,
    updateRequest: Boolean(query.updateRequest),
  })

  return NextResponse.json<GetData>({
    mediaList: await addLovesToMedia(mediaList, ctx.user.id),
  })
})
