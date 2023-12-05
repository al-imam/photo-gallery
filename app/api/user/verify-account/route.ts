import * as server from '$/server'
import { authVerifiedRouter } from '$/server/router'
import { NextRequest, NextResponse } from 'next/server'

export const POST = authVerifiedRouter(async (req: NextRequest, ctx: any) => {
  console.log(ctx)
  const body = await req.json()
  const result = await server.user.verifyAccount(body)
  return NextResponse.json({ data: result })
})
