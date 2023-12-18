import { NextResponse } from 'next/server'
import db from '/service/db'

export async function GET() {
  try {
    await db.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'n__e__v__e__r__m__i__n__d';`

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
