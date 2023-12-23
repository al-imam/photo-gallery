import { PrismaClient } from '@prisma/client'

let db: PrismaClient
const cacheKey = '___global_prisma_cache_key___'

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({ errorFormat: 'minimal' })
} else {
  //@ts-ignore
  global[cacheKey] ??= new PrismaClient({ errorFormat: 'pretty' })
  //@ts-ignore
  db = global[cacheKey]
}

export default db
