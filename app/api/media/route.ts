import { NextResponse } from 'next/server'
import { optAuthVerifiedRouter } from '/server/next/router'
import db from '/service/db'

export const GET = optAuthVerifiedRouter(async (req, ctx, next) => {
  const media = await db.media.findMany({
    where: { status: 'APPROVED' },
    distinct: ['id'],
    orderBy: {
      id: 'desc',
    },
    include: {
      author: true,
      category: true,
    },
  })
  return NextResponse.json({ data: media })
})
