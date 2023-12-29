import { ContentStatus, Media, MediaCategory, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'
import { USER_PUBLIC_FIELDS } from './config'
import { PrettifyPick } from './utils'

type ModifiedNextRequest = NextRequest & {
  json<T = unknown>(): Promise<T>
}

export type NextHandler<T = {}> = (
  req: ModifiedNextRequest,
  ctx: Record<string, any> & { params: Record<string, string | undefined> } & T,
  next: NextFunction
) => void

export type NextUserHandler<T = {}> = NextHandler<{ user: User } & T>
export type NextOptUserHandler<T = {}> = NextHandler<{ user?: User } & T>
export type NextUserMediaHandler = NextUserHandler<{ media: MediaPopulated }>

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
    id: string
    newEmail: string
  }
  'public-email': {
    id: string
    publicEmail: string
  }
  'reset-password': {
    id: string
    email: string
  }
}

export type UpdateMediaBody = PrettifyPick<
  Media,
  never,
  | 'title'
  | 'description'
  | 'note'
  | 'media_hasGraphicContent'
  | 'newCategory'
  | 'tags'
  | 'categoryId'
  | 'status'
> & { moderatorNote?: string }

export type FeaturedMediaOptions = {
  cursor?: string
  limit?: number
  category?: string
  authorId?: string
  status?: ContentStatus
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
