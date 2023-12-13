import { Router } from 'express'
import multer from 'multer'
import { catchError, checkAuthMiddleware, postMedia } from './controller'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
  '/upload',
  catchError(upload.single('media')),
  catchError(checkAuthMiddleware),
  catchError(postMedia)
)

export default router
