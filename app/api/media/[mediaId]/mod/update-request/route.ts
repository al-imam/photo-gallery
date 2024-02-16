import { onlyModerator } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import ReqErr from '@/service/ReqError'

// TODO: implement

export const GET = authRouter(onlyModerator, async (_, ctx, next) => {
  throw new ReqErr('This route is not implemented')
})

export const POST = authRouter(onlyModerator, async (_, ctx, next) => {
  throw new ReqErr('This route is not implemented')
})

export const DELETE = authRouter(onlyModerator, async (_, ctx, next) => {
  throw new ReqErr('This route is not implemented')
})
