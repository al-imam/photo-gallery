import { PrismaClient } from '@prisma/client'

let db: PrismaClient

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({ errorFormat: 'minimal' })
} else {
  // @ts-ignore
  global.prisma ??= new PrismaClient({ errorFormat: 'pretty' })
  // @ts-ignore
  db = global.prisma
}

export default db
