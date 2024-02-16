import ReqErr from '@/service/ReqError'
import { authRouter } from '@/server/router'
import { onlyModerator } from '@/server/middlewares/auth'

// TODO: implement

export const GET = authRouter(onlyModerator, async (_, ctx, next) => {
  throw new ReqErr('This route is not implemented')
})
