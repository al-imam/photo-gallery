import {
  NextHandler,
  NextUserHandler,
  NextOptUserHandler,
} from '/service/types'
import Router from 'router13'
import service from '/service'
import { NextResponse } from 'next/server'

export const router = Router.create<NextHandler>({
  middleware: [
    (req, param, next) => {
      console.log('::::: Init :::::')
      return next()
    },
  ],

  errorHandler: async (err: any) => {
    return NextResponse.json(
      { error: err.message, rawError: err },
      { status: 400 }
    )
  },
})

export const authRouter = router.create<NextUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      const token = req.headers.get('authorization')
      const user = await service.auth.checkAuth(token, 'auth')
      ctx.user = user
      return next()
    },
  ],
})

export const authVerifiedRouter = router.create<NextUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      const token = req.headers.get('authorization')
      const user = await service.auth.checkAuthVerified(token, 'auth')
      ctx.user = user
      return next()
    },
  ],
})

export const optAuthVerifiedRouter = router.create<NextOptUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      try {
        const token = req.headers.get('authorization')
        const user = await service.auth.checkAuthVerified(token, 'auth')
        ctx.user = user
      } catch {}

      return next()
    },
  ],
})

export const authNotVerifiedRouter = router.create<NextUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      const token = req.headers.get('authorization')
      const user = await service.auth.checkAuthNotVerified(token, 'auth')
      ctx.user = user
      return next()
    },
  ],
})
