import { Prisma } from '@prisma/client'

const result = {} as {
  -readonly [Key in keyof typeof Prisma as Key extends `${infer ModelName}ScalarFieldEnum`
    ? ModelName
    : never]: ArraySelect<keyof (typeof Prisma)[Key]>
}

class ArraySelect<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items)
    this.select = function (...keys: T[]) {
      return Array.from(new Set(keys))
    } as any
  }

  select: { <K extends T[]>(...keys: K): K }
}

for (let key in Prisma) {
  if (key.endsWith('ScalarFieldEnum')) {
    const modelName = key.slice(
      0,
      -'ScalarFieldEnum'.length
    ) as keyof typeof result
    const value = Object.keys(Prisma[key as keyof typeof Prisma])
    result[modelName] = new ArraySelect<any>(...value)
  }
}



console.log(result.User.select('id', 'id'))
