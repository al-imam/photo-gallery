import { serviceRouter } from '@/server/router'
import service from '@/service'

export const GET = serviceRouter(async (req) => {
  const take = req.nextUrl.searchParams.get('take')
  const result = await service.storage.getAvatarUrls(
    take ? Number(take) : undefined
  )
  return Response.json(result)
})

export const POST = serviceRouter(async (_, ctx) => {
  const result = await service.storage.updateAvatarUrls(ctx.body())
  return Response.json(result)
})
