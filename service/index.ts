import * as auth from './model/auth'
import * as user from './model/user'
import * as media from './model/media'

const service = { auth, user, media }
export default service

const _sdk: any = {}
for (const key in service) {
  _sdk[key] = {}

  for (const method in (service as any)[key]) {
    _sdk[key][method] = (...args: any[]) => {
      try {
        const rv = (service as any)[key][method](...args)
        return [
          rv instanceof Promise
            ? new Promise((res) =>
                rv
                  .then((v: any) => res([v, null]))
                  .catch((e: any) => res([null, e.message]))
              )
            : rv,
          null,
        ]
      } catch (e: any) {
        return [null, e.message]
      }
    }
  }
}

export const sdk = _sdk as {
  [K1 in keyof typeof service]: {
    [K2 in keyof (typeof service)[K1]]: (typeof service)[K1][K2] extends (
      ...args: any
    ) => any
      ? SDKMethod<(typeof service)[K1][K2]>
      : (typeof service)[K1][K2]
  }
}

interface SDKMethod<Fn extends (...args: any) => any> {
  (
    ...args: Parameters<Fn>
  ): ReturnType<Fn> extends Promise<any>
    ? Promise<[Awaited<ReturnType<Fn>> | null, string | null]>
    : [ReturnType<Fn> | null, string | null]
}
