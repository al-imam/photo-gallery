import { NextFunction, Request, Response } from 'express'
 import { checkAuth } from '../model/auth'
import createMedia from '../create-media'
type UserRequest = Request & { user?: any }

export function catchAsync(fn: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rv = fn(req, res, next)
      if (rv instanceof Promise) await rv
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}

export async function checkAuthMiddleware(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const user = await checkAuth(req.headers.authorization, 'auth')
  if (!user.isAccountVerified) throw new Error('User is not verified')
  req.user = user
  next()
}

export async function postMedia(req: UserRequest, res: Response) {
  if (!req.file) throw new Error('No file provided')
  const buffer = req.file.buffer
  const response = await createMedia(buffer, {
    ...req.body,
    authorId: req.user.id,
  })

  res.json({ data: response })
}
