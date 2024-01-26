import { Prisma } from '@prisma/client'

export const field = {} as {
  -readonly [Key in keyof typeof Prisma as Key extends `${infer ModelName}ScalarFieldEnum`
    ? ModelName
    : never]: {
    <const T extends (keyof (typeof Prisma)[Key])[]>(
      ...keys: [...T, Exclude<keyof (typeof Prisma)[Key], T[number]>]
    ): T extends [] ? (keyof (typeof Prisma)[Key])[] : T[number][]
  }
}

for (let key in Prisma) {
  if (key.endsWith('ScalarFieldEnum')) {
    const modelName = key.slice(
      0,
      -'ScalarFieldEnum'.length
    ) as keyof typeof field

    field[modelName] = function (...keys: any[]) {
      if (keys.length) {
        return Array.from(new Set(keys))
      }

      return Object.keys(Prisma[key as keyof typeof Prisma])
    } as any
  }
}
