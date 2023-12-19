import { Media, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'

type ModifiedNextRequest = NextRequest & {
  json<T = unknown>(): Promise<T>
}

export type NextHandler<T = {}> = (
  req: ModifiedNextRequest,
  ctx: Record<string, any> & T,
  next: NextFunction
) => void

export type NextUserHandler<T = {}> = NextHandler<{ user: User } & T>
export type NextOptUserHandler<T = {}> = NextHandler<{ user?: User } & T>
export type NextUserMediaHandler = NextUserHandler<{ media: Media }>

export type MediaWithLoves = Media & {
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
