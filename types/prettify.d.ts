/* eslint-disable @typescript-eslint/ban-types */
export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}
