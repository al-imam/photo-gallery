import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/next/router'
import { queryToNumber } from '@/server/next/utils'
import { MediaListOptions } from '@/service/model/media'
import { addLovesToMedia } from '@/service/model/media/helpers'
import { MediaWithLoves } from '@/service/types'

export type GetQuery = Partial<
  Record<keyof MediaListOptions, string> & Pick<MediaListOptions, 'status'>
>
export type GetData = {
  mediaList: MediaWithLoves[]
}
export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as GetQuery

  const mediaList = await service.media.getLatestMediaList(ctx.user, {
    ...query,
    skip: queryToNumber(query.skip),
    limit: queryToNumber(query.limit),
  })

  return NextResponse.json<GetData>({
    mediaList: await addLovesToMedia(mediaList, ctx.user?.id),
  })
})
