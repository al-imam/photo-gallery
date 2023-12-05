import { NextRequest, NextResponse } from 'next/server'
import router from 'router13'

export default router.create({
  middleware: [
    (req: NextRequest, param: any, next: Function) => {
      console.log('::::: Init :::::')
      return next()
    },
  ],

  errorHandler: async (err: any) => {
    return NextResponse.json({ body: { error: err.message } })
  },
})
