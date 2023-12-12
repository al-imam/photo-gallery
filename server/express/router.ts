import { Router } from 'express'
import multer from 'multer'
import { catchAsync, checkAuthMiddleware, postMedia } from './controller'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
  '/',
  upload.single('media'),
  catchAsync(checkAuthMiddleware),
  catchAsync(postMedia)
)

export default router
