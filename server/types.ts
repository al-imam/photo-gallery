import { User } from '@prisma/client'
import { NextRequest } from 'next/server'

export type UserHandler<T = {}> = (req: NextRequest, ctx: { user: User } & T, next: Function) => any
export function asUserHandler<T>(fn: UserHandler<T>) {
  return fn
}
