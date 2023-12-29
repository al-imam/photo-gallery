import { ContentStatus, Media, MediaCategory, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'
import { USER_PUBLIC_FIELDS } from './config'
import { PrettifyPick } from './utils'

type ModifiedNextRequest = NextRequest & {
  json<T = unknown>(): Promise<T>
}

export type NextHandler<TCtx = {}, TReq = {}> = (
  req: Omit<ModifiedNextRequest, keyof TReq> & TReq,
  ctx: Omit<
    { params: Record<string, string | undefined>; body<B = unknown>(): B },
    keyof TCtx
  > &
    TCtx,
  next: NextFunction
) => any

export type NextUserHandler<T = {}, TReq = {}> = NextHandler<
  { user: User } & T,
  TReq
>
export type NextOptUserHandler<T = {}, TReq = {}> = NextHandler<
  { user?: User } & T,
  TReq
>
export type NextUserMediaHandler<T = {}, TReq = {}> = NextUserHandler<
  { media: MediaPopulated } & T,
  TReq
>

export type MediaPopulated = Media & {
  author: PrettifyPick<User, (typeof USER_PUBLIC_FIELDS)[number]>
  category: MediaCategory | null
}

export type MediaWithLoves = MediaPopulated & {
  isLoved: boolean
  loves: number
  messageId: never
}

export type JWTPayload = {
  auth: string
  cookie: string
  'signup-email': string
  'change-email': {
    userId: string
    newEmail: string
  }
  'public-email': {
    userId: string
    publicEmail: string
  }
  'reset-password': {
    userId: string
    email: string
  }
}

export type DiscordCustomAttachment = {
  url: string
  height: number
  width: number
  size: number
}

export type DiscordMediaUploadResult = {
  id: string
  channel: string
  media: DiscordCustomAttachment
  thumbnail: DiscordCustomAttachment
}

export type DiscordAvatarUploadResult = {
  id: string
  channel: string
  avatar_sm: DiscordCustomAttachment
  avatar_md: DiscordCustomAttachment
  avatar_lg: DiscordCustomAttachment
}
