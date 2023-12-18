import { NextRequest, NextResponse } from 'next/server'
import db from '/service/db'

export async function GET(req: NextRequest) {
  try {
    await db.$connect()
    return NextResponse.json({
      ip: req.ip,
      ping: 'pong',
      db: 'connected',
    })
  } catch {
    return NextResponse.json({
      ip: req.ip,
      ping: 'pong',
      db: 'error',
    })
  }
}
