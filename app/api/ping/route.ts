import { NextRequest, NextResponse } from 'next/server'
import db from '/service/db'

export async function GET(req: NextRequest) {
  try {
    await db.$connect()
  } catch (err) {
  } finally {
    return NextResponse.json({
      ping: 'pong',
      ip: req.ip,
    })
  }
}
