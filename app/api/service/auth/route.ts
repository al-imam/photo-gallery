import { serviceRouter } from '@/server/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export const GET = serviceRouter(async (req) => {
  const token = req.headers.get('authorization')
  const user = await service.auth.checkAuth(token, 'auth')
  return NextResponse.json(user.id, { status: user ? 200 : 401 })
})
