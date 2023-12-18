import { NextRequest, NextResponse } from 'next/server'
import db from '/service/db'

export async function GET(req: NextRequest) {
  try {
    await db.$connect()
    return NextResponse.json({
      db: 'connected',
      date: new Date().toString(),
    })
  } catch {
    return NextResponse.json({
      db: 'error',
      date: new Date().toString(),
    })
  }
}
