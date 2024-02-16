import { onlyModerator } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import ReqErr from '@/service/ReqError'

// TODO:

export const POST = authRouter(onlyModerator, async (_, ctx, next) => {
  throw new ReqErr('This route is not implemented')
})