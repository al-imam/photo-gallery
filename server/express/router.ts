import { Router } from 'express'
import multer from 'multer'
import createMedia from './create-media'
import { catchError, checkAuthMiddleware } from './middleware'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
  '/upload',
  catchError(upload.single('media')),
  catchError(checkAuthMiddleware),
  catchError(createMedia)
)

export default router
