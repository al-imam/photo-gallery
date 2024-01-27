'use client'

import { NavBar } from '@/components/nav'
import { UploadImage } from '@/components/upload-image'
import { ImageUploadProvider, Submit } from '@/context/upload-images'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
import { Fragment, useRef, useState } from 'react'
import ImageUploading, { ImageType } from 'react-images-uploading'
import { toast } from 'sonner'

const maxNumber = 10

export default function Upload() {
  const [images, setImages] = useState<ImageType[]>([])
  const submitRefs = useRef<Record<string, Submit>>({})
  const [isAllSubmitting, setIsAllSubmitting] = useState(false)

  async function onSubmit() {
    setIsAllSubmitting(true)
    for (const id in submitRefs.current) {
      await submitRefs.current[id](async () => {
        const _image = images.find((img) => img.file?.name === id)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      })
    }
    setIsAllSubmitting(false)
  }

  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background mb-20">
      <NavBar takeHeight={true} />

      <ImageUploading
        multiple
        value={images}
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
        maxNumber={maxNumber}
        dataURLKey="data_url"
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
            <div>
              <div
                className={cn('flex flex-col gap-8', {
                  'mt-12': imageList.length > 0,
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
              <div
                {...dragProps}
                className={cn(
                  'flex flex-col gap-2 relative justify-center items-center p-8 sm:p-12 border border-dashed rounded-lg max-w-2xl mx-auto w-full my-10',
                  { 'bg-blue-500': isDragging }
                )}
              >
                <div className="absolute bottom-4 right-4 text-muted-foreground select-none">
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
            </div>
          </ImageUploadProvider>
        )}
      </ImageUploading>
      <div className="flex justify-between sm:justify-around ">
        <Button onClick={onSubmit}>Submit images</Button>
      </div>
    </div>
  )
}
