'use client'

import { NavBar } from '@/components/nav'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
import React, { Fragment } from 'react'
import ImageUploading, { ImageType } from 'react-images-uploading'

const maxNumber = 20

export default function Upload() {
  const [images, setImages] = React.useState<ImageType[]>([])

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
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div>
            <div className="flex flex-col gap-8 mt-8">
              {imageList.map((image, index) => (
                <Fragment key={image.dataURL}>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="rounded-lg overflow-hidden ">
                        <img
                          src={image.data_url}
                          alt={image.file?.name}
                          width="100"
                          className="min-w-full "
                        />
                      </div>
                      <div className="space-x-4 ">
                        <Button
                          variant={'ghost'}
                          size={'sm'}
                          onClick={() => onImageUpdate(index)}
                        >
                          Change
                        </Button>
                        <Button
                          variant={'ghost'}
                          size={'sm'}
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
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
        )}
      </ImageUploading>
    </div>
  )
}
