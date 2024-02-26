import { serviceRouter } from '@/server/router'
import service from '@/service'

export const GET = serviceRouter(async (req) => {
  const take = req.nextUrl.searchParams.get('take')
  const result = await service.storage.getMediaUrls(take ? Number(take) : 1000)
  return Response.json(result)
})

export const POST = serviceRouter(async (_, ctx) => {
  const result = await service.storage.updateMediaUrls(ctx.body())
  return Response.json(result)
})
