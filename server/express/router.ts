import { Router } from 'express'
import multer from 'multer'
import { createMedia, postAvatar } from './controller'
import { catchError, checkAuthMiddleware } from './middleware'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.use(catchError(checkAuthMiddleware))

router.post(
  '/upload',
  catchError(upload.single('media')),
  catchError(createMedia)
)

router.put(
  '/avatar',
  catchError(upload.single('avatar')),
  catchError(postAvatar)
)

export default router
