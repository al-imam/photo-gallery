import { Attachment } from 'discord.js'
import { DiscordCustomAttachment } from './types'

export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type PrettifyPick<
  T extends object,
  K extends keyof T,
  L extends keyof T = never,
> = Prettify<Pick<T, K> & Partial<Pick<T, L>>>

export type PrettifyOmit<
  T extends object,
  K extends keyof T,
  L extends keyof T = never,
> = Prettify<Omit<T, K> & Partial<Omit<T, L>>>

export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
) {
  const newObj: any = {}
  keys.forEach((key) => {
    const value = obj[key]
    if (value !== undefined) newObj[key] = value
  })

  return newObj as PrettifyPick<T, K>
}

export function createIncludeQuery<T extends readonly string[]>(args: T) {
  return Object.fromEntries(args.map((a) => [a, true])) as Prettify<
    Record<T[number], true>
  >
}

export function extractAttachment(
  attachment: Attachment
): DiscordCustomAttachment {
  return {
    url: `${attachment.id}/${attachment.name}`,
    height: attachment.height!,
    width: attachment.width!,
    size: attachment.size,
  }
}
