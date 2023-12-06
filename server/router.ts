import { User } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import Router, { NextFunction } from 'router13'
import * as service from './index'
import { NextHandler, NextUserHandler } from './types'

const router = Router.create<NextHandler>({
  middleware: [
    (req, param, next) => {
      console.log('::::: Init :::::')
      return next()
    },
  ],

  errorHandler: async (err: any) => {
    return NextResponse.json({ error: err.message })
  },
})

export const authRouter = router.create<NextUserHandler>({
  middleware: [
    async (req, ctx, next) => {
      const token = (req.headers as any).authorization
      const user = await service.auth.checkAuth(token, 'auth')
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

export default router
