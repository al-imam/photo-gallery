import * as auth from './auth'

export type * from './auth'

const service = { auth }

const _sdk: any = {}
for (const key in service) {
  _sdk[key] = {}

  for (const method in (service as any)[key]) {
    _sdk[key][method] = async (...args: any[]) => {
      try {
        const rv = (service as any)[key][method](...args)

        if (rv instanceof Promise) {
          const result = await rv
          return [result, null]
        }

        return [rv, null]
      } catch (e: any) {
        return [null, e.message]
      }
    }
  }
}

const sdk = _sdk as {
  [K1 in keyof typeof service]: {
    [K2 in keyof (typeof service)[K1]]: (typeof service)[K1][K2] extends (
      ...args: any
    ) => any
      ? SDKMethod<(typeof service)[K1][K2]>
      : (typeof service)[K1][K2]
  }
}

type BullShitUnion<T, U> = [T, null] | [null, U]

interface SDKMethod<Fn extends (...args: any) => any> {
  (
    ...args: Parameters<Fn>
  ): ReturnType<Fn> extends Promise<any>
    ? Promise<BullShitUnion<Awaited<ReturnType<Fn>>, string>>
    : BullShitUnion<ReturnType<Fn>, string>
}

export default sdk
