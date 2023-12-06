import * as jose from 'jose'
import { NextRequest } from 'next/server'
import { UserHandler, asUserHandler } from '../types'

export const sendUserAndToken: UserHandler = (req, ctx) => {
  return {
    user: ctx.user,
    token: ctx,
  }
}
