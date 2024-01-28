'use client'

import { NavBar } from '@/components/nav'
import { UploadImage } from '@/components/upload-image'
import { ImageUploadProvider, Submit } from '@/context/upload-images'
import { useAuth } from '@/hooks'
import { FilesIllustration, SpinnerIcon } from '@/icons'
import { uuid } from '@/lib'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
import { Modify } from '@/types'
import { joinUrl } from '@/util'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircleIcon } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import ImageUploading, { ImageType } from 'react-images-uploading'
import { toast } from 'sonner'

const requirements = [
  'Uploaded images must be freely usable by everyone',
  'Keep file sizes within specified limits for optimization',
  'Ensure images meet acceptable dimensions for consistent presentation',
  'Upload images in supported formats',
  'Maintain a standard to avoid blurry or pixelated images',
  'Do not upload inappropriate or prohibited content',
  'Include relevant metadata',
  'Provide alt text for accessibility',
  'Images should use supported color profiles',
  'Follow acceptable orientations',
]

const maxNumber = 10

type TypeImage = Modify<ImageType, { file: File }>

export default function Upload() {
  const { auth } = useAuth()
  const [images, setImages] = useState<(TypeImage & { id: string })[]>([])
  const submitRefs = useRef<Record<string, Submit>>({})
  const [isAllSubmitting, setIsAllSubmitting] = useState(false)

  async function onSubmit() {
    setIsAllSubmitting(true)

    for (const [key, submit] of Object.entries(submitRefs.current)) {
      await submit(async (values) => {
        const img = images.find((img) => img.file?.name === key)
        if (!img || !img.file) return

        const form = new FormData()
        form.append('file', img.file)
        form.append('title', values.title)
        form.append('description', values.description)
        form.append('tags', JSON.stringify(values.tags.map((tag) => tag.value)))
        form.append('categoryId', values.category!)

        try {
          await axios.post(
            joinUrl(process.env.NEXT_PUBLIC_API_URL, 'media'),
            form,
            { headers: { Authorization: auth } }
          )

          toast.success(`Successfully uploaded "${values.title}"`)

          return setImages((prev) => prev.filter((cImg) => cImg.id !== img.id))
        } catch (error) {
          return toast.error(`Failed to upload "${values.title}"`)
        }
      })
    }

    setIsAllSubmitting(false)
  }

  function handleImageUpload(_images: TypeImage[], aui: number[] | undefined) {
    if (!Array.isArray(aui)) {
      const [dImg] = images.filter(
        (cImg) => !_images.find((pImg) => pImg.file.name === cImg.file.name)
      )

      return setImages((prev) =>
        prev.filter((img) => img.file.name !== dImg.file.name)
      )
    }

    if (aui && aui.length === 1 && images.length > aui[0]) {
      const newImages = [...images]
      newImages[aui[0]] = { ..._images[aui[0]], id: newImages[aui[0]].id }
      return setImages(newImages)
    }

    const newAllImages = _images.filter(
      (img, index) =>
        aui.includes(index) &&
        !images.find((pImg) => pImg.file.name === img.file.name)
    )

    return setImages((prev) => [
      ...prev,
      ...newAllImages.map((cImg) => ({ ...cImg, id: uuid() })),
    ])
  }

  const isHasImage = images.length > 0

  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background gap-y-10 sm:gap-y-16 pb-20">
      <NavBar takeHeight={true} />

      <ImageUploading
        multiple
        value={images}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        onChange={handleImageUpload as any}
      >
        {({ imageList, onImageUpload, isDragging, dragProps, ...rest }) => (
          <ImageUploadProvider
            value={{
              imageList,
              onImageUpload,
              isDragging,
              dragProps,
              submitRefs,
              isAllSubmitting,
              ...rest,
            }}
          >
            {isHasImage && (
              <div className={cn('flex flex-col gap-8')}>
                <AnimatePresence mode="popLayout">
                  {imageList.map((image, index) => (
                    <Fragment key={image.id}>
                      <motion.div
                        key={image.id}
                        layout
                        initial={{ opacity: 0, x: -400, scale: 0.5 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 200, scale: 1.2 }}
                        transition={{ duration: 0.6, type: 'spring' }}
                      >
                        <UploadImage image={image} index={index} />
                      </motion.div>
                      {imageList.length > index + 1 && (
                        <hr className="border-dashed" />
                      )}
                    </Fragment>
                  ))}
                </AnimatePresence>
              </div>
            )}
            <div
              {...dragProps}
              className={cn(
                'isolate flex flex-col gap-2 relative justify-center items-center py-16 px-8 border border-dashed rounded-lg max-w-2xl mx-auto w-full overflow-hidden bg-background',
                {
                  'my-[20vh]': !isHasImage,
                  'pointer-events-none': isAllSubmitting,
                }
              )}
            >
              <div
                className={cn(
                  'absolute inset-[1px] bg-blue-300 dark:bg-blue-600 -z-10 rounded-lg scale-95 opacity-0 pointer-events-none transition-none duration-300',
                  { 'opacity-100 scale-100 transition-all': isDragging }
                )}
              ></div>
              <div
                className={cn(
                  'absolute bottom-4 right-4 text-foreground/80 select-none pointer-events-none',
                  { 'opacity-0': isDragging }
                )}
              >
                ({maxNumber}/{images.length})
              </div>
              <span className="text-center pointer-events-none select-none">
                Drag and drop {isHasImage ? 'more' : 'your'} images here <br />{' '}
                or
              </span>

              <Button
                onClick={onImageUpload}
                disabled={isAllSubmitting}
                variant={isHasImage ? 'secondary' : 'default'}
                className={cn('w-max transition-all duration-500', {
                  'pointer-events-none': isDragging,
                })}
              >
                Explore
              </Button>
            </div>
          </ImageUploadProvider>
        )}
      </ImageUploading>
      {isHasImage && (
        <div className="flex justify-between items-center sm:justify-evenly relative sm:mb-0 mb-10">
          <span>Thank you for contributing</span>
          <Button onClick={onSubmit} disabled={isAllSubmitting}>
            {isAllSubmitting && (
              <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit images
          </Button>
        </div>
      )}

      <div className="space-y-1.5 relative">
        <FilesIllustration className="absolute -left-1/3 -top-full w-full h-[200%] -z-50 opacity-20 dark:opacity-[0.02]" />
        {requirements.map((requirement) => (
          <div key={requirement} className="flex items-start gap-2">
            <span className="inline-flex h-[1.5rem] justify-center items-center">
              <CheckCircleIcon className="h-4 min-h-[1rem] w-4 min-w-[1rem] text-success" />
            </span>
            <span>{requirement}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
