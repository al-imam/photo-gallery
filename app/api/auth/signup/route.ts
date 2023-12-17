import { NextResponse } from 'next/server'
import { router } from '/server/next/router'
import service from '/service'

export type POST = { message: string }
export const POST = router(async (req, ctx, next) => {
  const { email } = await req.json()
  await service.auth.signup(email)
  return NextResponse.json({ message: 'Check your email' })
})
