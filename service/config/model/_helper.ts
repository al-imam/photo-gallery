import { Prisma } from '@prisma/client'

type Result = {
  [Key in keyof typeof Prisma as Key extends `${infer Name}ScalarFieldEnum`
    ? Name
    : never]: {
    <const T extends (keyof (typeof Prisma)[Key])[]>(...keys: T): T
  }
}

const model = {} as Result
for (let key in Prisma) {
  if (key.endsWith('ScalarFieldEnum')) {
    const name = key.slice(0, -'ScalarFieldEnum'.length)
    ;(model as any)[name] = (...keys: string[]) => keys
  }
}

export default model
