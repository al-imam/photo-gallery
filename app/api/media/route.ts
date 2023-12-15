import { NextResponse } from 'next/server'
import { queryToNumber } from '/server/next/utils'
import service from '/service'
import { optionalAuthRouter } from '/server/next/router'

export const GET = optionalAuthRouter(async (req, ctx) => {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries())

  return NextResponse.json({
    media: await service.media.getFeaturedMedia(ctx.user?.id, {
      limit: queryToNumber(query.limit),
      skip: queryToNumber(query.skip),
      category: query.category,
      authorId: query.authorId,
    }),
  })
})
