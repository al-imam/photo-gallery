import { NextResponse } from 'next/server'
import { queryToNumber } from '/server/next/utils'
import service from '/service'
import { optionalAuthRouter } from '/server/next/router'

export const dynamic = 'force-dynamic'

export type GetQuery = {
  cursor?: string
  limit?: string
  category?: string
  authorId?: string
}
export type GetData = {
  media: Awaited<ReturnType<typeof service.media.getFeaturedMedia>>
}

export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as GetQuery

  return NextResponse.json<GetData>({
    media: await service.media.getFeaturedMedia(ctx.user?.id, {
      category: query.category,
      authorId: query.authorId,
    }),
  })
})
