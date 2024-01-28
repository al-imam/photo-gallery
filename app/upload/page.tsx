'use client'

import { NavBar } from '@/components/nav'
import { UploadImage } from '@/components/upload-image'
import { ImageUploadProvider, Submit } from '@/context/upload-images'
import { FilesIllustration, SpinnerIcon } from '@/icons'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
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

export default function Upload() {
  const [images, setImages] = useState<ImageType[]>([])
  const submitRefs = useRef<Record<string, Submit>>({})
  const [isAllSubmitting, setIsAllSubmitting] = useState(false)

  async function onSubmit() {
    setIsAllSubmitting(true)

    for (const id in submitRefs.current) {
      await submitRefs.current[id](async () => {
        const img = images.find((img) => img.file?.name === id)
        if (!img || !img.file) return

        const form = new FormData()
        form.append('file', img.file)
      })
    }
    setIsAllSubmitting(false)
  }

  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background gap-y-10 sm:gap-y-16 pb-20">
      <NavBar takeHeight={true} />

      <ImageUploading
        multiple
        value={images}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        onChange={(_images) => {
          if (_images.length > images.length) {
            const _lastImg = _images.at(-1)

            if (
              _lastImg &&
              images.find((img) => img.file?.name === _lastImg.file?.name)
            ) {
              return toast.warning('Can not upload same image twice!')
            }
          }

          setImages(_images)
        }}
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
            {imageList.length > 0 && (
              <div
                className={cn('flex flex-col gap-8', {
                  'mt-12': imageList.length > 1000,
                })}
              >
                {imageList.map((image, index) => (
                  <Fragment key={image.file?.name}>
                    <UploadImage image={image} index={index} />
                    {imageList.length > index + 1 && (
                      <hr className="border-dashed" />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
            <div
              {...dragProps}
              className={cn(
                'isolate flex flex-col gap-2 relative justify-center items-center py-16 px-8 border border-dashed rounded-lg max-w-2xl mx-auto w-full overflow-hidden bg-background',
                { 'my-[20vh]': imageList.length === 0 }
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
                Drag and drop {imageList.length > 0 ? 'more' : 'your'} images
                here <br /> or
              </span>

              <Button
                onClick={onImageUpload}
                className={cn('w-max', { 'pointer-events-none': isDragging })}
              >
                Explore
              </Button>
            </div>
          </ImageUploadProvider>
        )}
      </ImageUploading>
      {images.length > 0 && (
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
