import { NextResponse } from 'next/server'
import Router from 'router13'
import * as service from './index'
import { NextHandler, NextUserHandler } from './types'

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
      const token = req.headers.get('authorization')?.replace(/^Bearer /, '')
      const user = await service.auth.checkAuth(token, 'auth')
      if (user.hasBeenBanned) throw new Error('User has been banned')
      ctx.user = user
      return next()
    },
  ],
})

export const authVerifiedRouter = authRouter.create({
  middleware: [
    async (req, ctx, next) => {
      if (!ctx.user.isAccountVerified) throw new Error('User is not verified')
      return next()
    },
  ],
})

export const authNotVerifiedRouter = authRouter.create({
  middleware: [
    async (req, ctx, next) => {
      if (ctx.user.isAccountVerified) throw new Error('User is verified')
      return next()
    },
  ],
})
