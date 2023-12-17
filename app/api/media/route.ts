import { NextResponse } from 'next/server'
import { queryToNumber } from '/server/next/utils'
import service from '/service'
import { optionalAuthRouter } from '/server/next/router'

export type GETBody = {
  media: Awaited<ReturnType<typeof service.media.getFeaturedMedia>>
}

export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries())

  return NextResponse.json<GETBody>({
    media: await service.media.getFeaturedMedia(ctx.user?.id, {
      limit: queryToNumber(query.limit),
      skip: queryToNumber(query.skip),
      category: query.category,
      authorId: query.authorId,
    }),
  })
})
