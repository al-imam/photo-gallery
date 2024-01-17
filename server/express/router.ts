import { Router } from 'express'
import multer from 'multer'
import { createMedia, deleteMedia, postAvatar } from './controller'
import { catchError, checkAuthMiddleware } from './middleware'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.use(catchError(checkAuthMiddleware))

router.delete('/media/:id', catchError(deleteMedia))
router.post(
  '/media',
  catchError(upload.single('media')),
  catchError(createMedia)
)

router
  .route('/avatar')
  .post(catchError(upload.single('avatar')), catchError(postAvatar))
  .delete(catchError(deleteMedia))

export default router
