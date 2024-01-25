import { MediaCategory, PrismaClient, Profile, User } from '@prisma/client'

let db: PrismaClient
const cacheKey = '___global_prisma_cache_key___'

function handleOperationToLowerCase<Obj>(...keys: (keyof Obj)[]) {
  return function handleOperation({ args, query }: any) {
    const newArgs = { ...args }
    keys.forEach((key) => {
      const { where } = newArgs
      if (typeof where?.[key] === 'string') {
        where[key] = where[key].toLowerCase()
      }

      const { data } = newArgs
      if (typeof data?.[key] === 'string') {
        data[key] = data[key].toLowerCase()
      }
    })

    return query(newArgs)
  }
}

function createClient(errorFormat: 'minimal' | 'pretty') {
  return new PrismaClient({ errorFormat }).$extends({
    query: {
      user: {
        $allOperations: handleOperationToLowerCase<User>('email', 'username'),
      },

      mediaCategory: {
        $allOperations: handleOperationToLowerCase<MediaCategory>('name'),
      },

      profile: {
        $allOperations: handleOperationToLowerCase<Profile>('email'),
      },
    },
  }) as unknown as PrismaClient
}

if (process.env.NODE_ENV === 'production') {
  db = createClient('minimal')
} else {
  // @ts-ignore
  global[cacheKey] ??= createClient('pretty')
  // @ts-ignore
  db = global[cacheKey]
}

export default db
export * from '@prisma/client'
