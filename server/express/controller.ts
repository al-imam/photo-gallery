import { NextFunction, Request, Response } from 'express'
import service from '../../service'
import createMedia from './create-media'
type UserRequest = Request & { user?: any }

export function catchError(fn: any) {
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
  req.user = await service.auth.checkAuthVerified(
    req.headers.authorization,
    'auth'
  )
  next()
}

export async function postMedia(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new Error('No file provided')
  const response = await createMedia(buffer, {
    ...req.body,
    authorId: req.user.id,
  })

  res.json({ data: response })
}
