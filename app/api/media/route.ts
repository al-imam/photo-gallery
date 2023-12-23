import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/next/router'
import { queryToNumber } from '@/server/next/utils'
import { FeaturedMediaOptions } from '@/service/model/media/types'

export type GetQuery = Partial<Record<keyof FeaturedMediaOptions, string>>
export type GetData = {
  media: Awaited<ReturnType<typeof service.media.getFeaturedMedia>>
}

let a: GetData

export const dynamic = 'force-dynamic'
export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as GetQuery

  return NextResponse.json<GetData>({
    media: await service.media.getFeaturedMedia(ctx.user?.id, {
      cursor: query.cursor,
      category: query.category,
      authorId: query.authorId,
      limit: queryToNumber(query.limit),
    }),
  })
})
