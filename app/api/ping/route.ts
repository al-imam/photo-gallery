import { NextResponse } from 'next/server'
import db from '@/service/db'

export async function GET() {
  try {
    await db.user.findFirst()
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
