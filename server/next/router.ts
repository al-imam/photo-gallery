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
  middleware: [
    async (req, ctx, next) => {
      ctx.query = function () {
        return Object.fromEntries(req.nextUrl.searchParams.entries())
      } as any

      const contentType = req.headers.get('content-type')

      try {
        if (contentType?.includes('application/json')) {
          const body = await (req as any).json()
          ctx.body = () => body
        } else {
          throw Error('Content-Type must be application/json')
        }
      } catch {
        ctx.body<null> = () => null
      }

      return next()
    },
  ],
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
      } catch {
        ctx.user = undefined
      }

      return next()
    },
  ],
})
