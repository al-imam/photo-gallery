import * as server from '$/server'
import router, { authRouter } from '$/server/router'
import { NextResponse } from 'next/server'

export const POST = router(async (req) => {
  const body = await req.json()
  const result = await server.user.create(body)
  return NextResponse.json({ data: result })
})

export const GET = authRouter(async (req) => {
  const result = await server.user.find()
  return NextResponse.json({ data: result })
})
