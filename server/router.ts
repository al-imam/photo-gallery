import { NextRequest, NextResponse } from 'next/server'
import Router from 'router13'

const router = Router.create({
  middleware: [
    (req: NextRequest, param: any, next: Function) => {
      console.log('::::: Init :::::')
      return next()
    },
  ],

  errorHandler: async (err: any) => {
    return NextResponse.json({ error: err.message })
  },
})

export const authRouter = Router.create({
  middleware: [
    (req: NextRequest, param: any, next: Function) => {
      console.log('::::: Auth Init :::::')
      return next()
    },
  ],
})

export const authVerifiedRouter = Router.create({
  middleware: [
    async (req: NextRequest, ctx: any, next: Function) => {
      ctx.test = 'test'
      console.log('::::: authVerifiedRouter Init :::::')
      return next()
    },
  ],
})

export const authNonVerifiedRouter = Router.create({
  middleware: [
    (req: NextRequest, param: any, next: Function) => {
      console.log('::::: authNonVerifiedRouter Init :::::')
      return next()
    },
  ],
})

export default router
