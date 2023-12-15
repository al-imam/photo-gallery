import { NextResponse } from 'next/server'
import { authOptVerifiedRouter } from '/server/next/router'
import { queryToNumber } from '/server/next/utils'
import service from '/service'

export const GET = authOptVerifiedRouter(async (req, ctx) => {
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
