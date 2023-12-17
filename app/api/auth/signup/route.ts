import { NextResponse } from 'next/server'
import { router } from '/server/next/router'
import service from '/service'

export type POSTBody = { message: string }
export const POST = router(async (req) => {
  const { email } = await req.json()
  await service.auth.signup(email)
  return NextResponse.json<POSTBody>({ message: 'Check your email' })
})
