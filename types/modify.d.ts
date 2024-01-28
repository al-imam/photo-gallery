import { Prettify } from './prettify'

export type Modify<T extends object, U extends Partial<T>> = Prettify<
  Omit<T, keyof U> & U
>
