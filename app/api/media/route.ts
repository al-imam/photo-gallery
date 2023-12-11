import { NextRequest, NextResponse } from 'next/server'
import { media } from '/server'
import { authVerifiedRouter } from '/server/router'

export const POST = authVerifiedRouter(async (req: NextRequest, ctx) => {
  const body = await req.formData()
  const file = body.get('file') as File
  if (!file) throw new Error('No file provided')
  const buffer = Buffer.from(await file.arrayBuffer())
  const data: Record<string, any> = {}
  body.forEach((value, key) => {
    if (key === 'file') return
    data[key] = value
  })

  const response = await media.create(buffer, {
    ...data,
    authorId: ctx.user.id,
  })

  return NextResponse.json({ data: response })
})
