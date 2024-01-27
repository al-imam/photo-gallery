'use client'

import { NavBar } from '@/components/nav'
import { UploadImage } from '@/components/upload-image'
import { ImageUploadProvider } from '@/context/upload-images'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
import { Fragment, useState } from 'react'
import ImageUploading, { ImageType } from 'react-images-uploading'

const maxNumber = 10

export default function Upload() {
  const [images, setImages] = useState<ImageType[]>([])

  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background">
      <NavBar takeHeight={true} />

      <ImageUploading
        multiple
        value={images}
        onChange={(_images) => setImages(_images)}
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
                  <Fragment key={image.dataURL}>
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
                  'flex flex-col gap-2 justify-center items-center p-4 sm:p-8 border border-dashed rounded-lg max-w-2xl mx-auto w-full my-10',
                  { 'bg-blue-500': isDragging }
                )}
              >
                <span className="text-center pointer-events-none">
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
    </div>
  )
}
