import { Media, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'

export type NextHandler = (
  req: NextRequest,
  ctx: Record<string, any>,
  next: NextFunction
) => void

export type NextUserHandler = (
  req: NextRequest,
  ctx: Record<string, any> & { user: User },
  next: NextFunction
) => void

export type NextOptUserHandler = (
  req: NextRequest,
  ctx: Record<string, any> & { user?: User },
  next: NextFunction
) => void

export type MediaWithLoves = Media & { isLoved: boolean; loves: number }

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
