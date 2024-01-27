import { ImageUploadContext } from '@/context/upload-images'
import { useContext } from 'react'

export function useImageUpload() {
  const values = useContext(ImageUploadContext)
  if (values) return values
  throw new Error('useImageUpload only works inside `imageUploadContext`!')
}
