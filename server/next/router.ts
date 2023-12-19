import {
  NextHandler,
  NextUserHandler,
  NextOptUserHandler,
} from '@/service/types'
import Router from 'router13'
import service from '@/service'
import { NextResponse } from 'next/server'
import errorFormat from '@/service/errorFormat'

export const router = Router.create<NextHandler>({
  middleware: [],
  errorHandler: async (err: any) => {
    const [message, status] = errorFormat(err)
    return NextResponse.json({ error: message.toString() }, { status })
  },
})

export const authRouter = router.create<NextUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      const token = req.headers.get('authorization')
      ctx.user = await service.auth.checkAuth(token, 'auth')
      return next()
    },
  ],
})

export const optionalAuthRouter = router.create<NextOptUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      try {
        const token = req.headers.get('authorization')
        ctx.user = await service.auth.checkAuth(token, 'auth')
      } catch {}
      return next()
    },
  ],
})
