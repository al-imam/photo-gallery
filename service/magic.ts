import { Prettify } from "./utils"

function Factory<
  Model extends Record<string, any>,
  Obj extends Record<string, any>,
>(model: Model, object: Obj) {
  return {
    create<TAs extends string, TKeys extends (keyof Model)[]>(
      as: TAs,
      ...keys: TKeys
    ) {
      return Factory(model, { ...object, [as]: keys } as Obj & {
        [key in TAs]: TKeys
      })
    },

    createFrom<
      TFrom extends keyof Obj,
      TAs extends string,
      TKeys extends Exclude<keyof Model, Obj[TFrom][number]>[],
    >(from: TFrom, as: TAs, ...keys: TKeys) {
      return Factory(model, {
        ...object,
        [as]: [...object[from], ...keys],
      } as Obj & {
        [key in TAs]: [...Obj[TFrom], ...TKeys]
      })
    },

    parse() {
      return object as Prettify<typeof object>
    },
  }
}

export default function <T extends Record<string, any>>(model: T) {
  return Factory(model, {})
}
