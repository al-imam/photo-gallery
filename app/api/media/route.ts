import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/next/router'
import { queryToNumber } from '@/server/next/utils'
import { ContentStatus } from '@prisma/client'
import { MediaListOptions } from '@/service/model/media'
 
export type GetQuery = Partial<Record<keyof MediaListOptions, string>>
export type GetData = {
  mediaList: Awaited<ReturnType<typeof service.media.getLatestMediaList>>
}

export const dynamic = 'force-dynamic'
export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as GetQuery

  const mediaList = await service.media.getLatestMediaList(ctx.user, {
    cursor: query.cursor,
    category: query.category,
    authorId: query.authorId,
    status: query.status as ContentStatus,
    limit: queryToNumber(query.limit),
  })

  return NextResponse.json<GetData>({ mediaList })
})
