import { sendUserAndToken } from '/server/next/middlewares/auth'
import { authRouter } from '/server/next/router'

export const GET = authRouter(sendUserAndToken)
