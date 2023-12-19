import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import service from '@/service'
import errorFormat from '@/service/errorFormat'

export type UserRequest = Request & { user: User }

export function catchError(fn: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rv = fn(req, res, next)
      if (rv instanceof Promise) await rv
    } catch (err: any) {
      const [message, status] = errorFormat(err)
      res.status(status).json({ error: message })
    }
  }
}

export async function checkAuthMiddleware(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  req.user = await service.auth.checkAuth(req.headers.authorization, 'auth')
  next()
}
