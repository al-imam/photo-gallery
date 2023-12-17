import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({ errorFormat: 'pretty' })

export * from '@prisma/client'
export default db
