import { serviceUserRouter } from '@/server/router'
import { CreateMediaApiBody, CreateMediaBody } from '@/service/model/media'
import { NextResponse } from 'next/server'
import service from '@/service'
import { addLovesToMedia } from '@/service/model/media/helpers'

export type PostBody = CreateMediaApiBody
export type PostData = {
  media: Awaited<ReturnType<typeof addLovesToMedia>>
}
export const POST = serviceUserRouter(async (_, ctx) => {
  const media = await service.media.createMedia(
    ctx.user,
    ctx.body<CreateMediaBody>()
  )

  return NextResponse.json<PostData>({
    media: await addLovesToMedia(media),
  })
})
