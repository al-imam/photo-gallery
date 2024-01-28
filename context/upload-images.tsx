import { Item } from '@/components/multi-select'
import { ComponentProps, createContext } from 'react'
import { UseFormReset } from 'react-hook-form'
import { ExportInterface } from 'react-images-uploading/dist/typings'

export interface ImageFormValues {
  title: string
  description: string
  category: string | undefined
  tags: Item[]
}

export type Submit = (
  callback: (value: ImageFormValues) => Promise<void> | void | Promise<any>
) => Promise<UseFormReset<ImageFormValues>>

export const ImageUploadContext = createContext<
  | (ExportInterface & {
      submitRefs: React.MutableRefObject<Record<string, Submit>>
      isAllSubmitting: boolean
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
