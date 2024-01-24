import { serviceRouter } from '@/server/next/router'
import { NextResponse } from 'next/server'

export const POST = serviceRouter((req, ctx, next) => {
  const body = ctx.body()
  return NextResponse.json({ message: 'ok', body })
})
