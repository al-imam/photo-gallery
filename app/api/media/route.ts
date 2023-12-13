import { NextResponse } from 'next/server'
import { optAuthVerifiedRouter } from '/server/next/router'
import db from '/service/db'
import { USER_PUBLIC_FIELDS_QUERY } from '/service/config'
import { addLovesToMedia } from '/service/model/media'

export const GET = optAuthVerifiedRouter(async (_, ctx) => {
  const media = await db.media.findMany({
    where: { status: 'APPROVED' },
    orderBy: {
      id: 'desc',
    },
    include: {
      author: { select: USER_PUBLIC_FIELDS_QUERY },
      category: true,
    },
  })

  return NextResponse.json({
    data: await addLovesToMedia(ctx.user?.id, ...media),
  })
})
