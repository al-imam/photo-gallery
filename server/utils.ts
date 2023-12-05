export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type PrettifyPick<
  T extends object,
  K extends keyof T,
  L extends keyof T = never
> = Prettify<Pick<T, K> & Partial<Pick<T, L>>>

export type PrettifyOmit<
  T extends object,
  K extends keyof T,
  L extends keyof T = never
> = Prettify<Omit<T, K> & Partial<Omit<T, L>>>
