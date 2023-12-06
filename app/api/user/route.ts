import * as server from '$/server'
import router from '$/server/router'
import { NextResponse } from 'next/server'

export const POST = router(async req => {
  const body = await req.json()
  const result = await server.user.create(body)
  return NextResponse.json({ data: result })
})
