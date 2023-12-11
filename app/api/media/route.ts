import { NextRequest, NextResponse } from 'next/server'
import { media } from '/server'

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const file = body.get('file') as File
  const buffer = Buffer.from(await file.arrayBuffer())

  const response = await media.create(buffer, {
    authorId: '657073843ff831a4dd15d97a',
  })

  return NextResponse.json(response)
}
