import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/next/router'
import { queryToNumber } from '@/server/next/utils'
import { FeaturedMediaOptions } from '@/service/model/media/types'
import { ContentStatus } from '@prisma/client'

export type GetQuery = Partial<Record<keyof FeaturedMediaOptions, string>>
export type GetData = {
  mediaList: Awaited<ReturnType<typeof service.media.getLatestMediaList>>
}

export const dynamic = 'force-dynamic'
export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as GetQuery

  return NextResponse.json<GetData>({
    mediaList: await service.media.getLatestMediaList(ctx.user, {
      cursor: query.cursor,
      category: query.category,
      authorId: query.authorId,
      status: query.status as ContentStatus,
      limit: queryToNumber(query.limit),
    }),
  })
})
