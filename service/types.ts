import { Media, MediaCategory, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'
import { USER_PUBLIC_FIELDS } from './config'
import { Prettify, PrettifyPick } from './utils'

type NextCtx = {
  params: Record<string, string | undefined>
  body<B = unknown>(): B
}

export type NextHandler<TCtx = {}> = (
  req: Omit<NextRequest, 'json' | 'body'>,
  ctx: Prettify<Omit<NextCtx, keyof TCtx> & TCtx>,
  next: NextFunction
) => any

export type NextUserHandler<T = {}> = NextHandler<{ user: User } & T>
export type NextOptUserHandler<T = {}> = NextHandler<{ user?: User } & T>
export type NextUserMediaHandler<T = {}> = NextUserHandler<
  {
    media: MediaWithReactionCount
    relatedMedia?: MediaWithReactionCount[]
  } & T
>

export type MediaWithReactionCount = Media & {
  author: PrettifyPick<User, (typeof USER_PUBLIC_FIELDS)[number]>
  category: MediaCategory | null
  _count: {
    Z_REACTIONS: number
  }
}

export type MediaWithLoves = Omit<
  MediaWithReactionCount,
  '_count' | 'messageId'
> & {
  isLoved: boolean
  loves: number
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
    profileEmail: string
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
