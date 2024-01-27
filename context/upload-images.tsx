import { Item } from '@/components/multi-select'
import { ComponentProps, createContext } from 'react'
import { ExportInterface } from 'react-images-uploading/dist/typings'

export interface ImageFormValues {
  title: string
  description: string
  category: string | undefined
  tags: Item[]
}

export const ImageUploadContext = createContext<
  | (ExportInterface & {
      submitRefs: React.MutableRefObject<Record<string, HTMLFormElement>>
      setImageFormList: React.Dispatch<
        React.SetStateAction<
          (ImageFormValues & {
            id: string
          })[]
        >
      >
    })
  | null
>(null)

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
