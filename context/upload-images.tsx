import { ComponentProps, createContext } from 'react'
import { ExportInterface } from 'react-images-uploading/dist/typings'

export const ImageUploadContext = createContext<ExportInterface | null>(null)

export function ImageUploadProvider({
  children,
  value,
}: ComponentProps<typeof ImageUploadContext.Provider>) {
  return (
    <ImageUploadContext.Provider value={value}>
      {children}
    </ImageUploadContext.Provider>
  )
}
