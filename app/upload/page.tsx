'use client'

import { Item, MultiSelect } from '@/components/multi-select'
import { NavBar } from '@/components/nav'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { cn } from '@/shadcn/utils'
import React, { Fragment } from 'react'
import ImageUploading, { ImageType } from 'react-images-uploading'

const maxNumber = 20

function createTags(tags: string[]) {
  return tags.map((tag) => ({ value: tag, label: tag }))
}

const photoTags = createTags([
  'Nature',
  'Architecture',
  'Portrait',
  'Landscape',
  'Food',
  'Travel',
  'Animals',
  'Technology',
  'Black and White',
  'Abstract',
])

export default function Upload() {
  const [images, setImages] = React.useState<ImageType[]>([])
  const [tags, setTags] = React.useState<Item[]>([])

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
            <div className="flex flex-col gap-8">
              {imageList.map((image, index) => (
                <Fragment key={image.dataURL}>
                  <div className="grid lg:grid-cols-2 gap-x-8 gap-y-4">
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

                    <div className="space-y-4">
                      <Input placeholder="Title" />
                      <Input placeholder="description" />
                      <Input placeholder="Category" />
                      <MultiSelect
                        placeholder="Create tags"
                        items={photoTags}
                        selected={tags}
                        limit={5}
                        setSelected={setTags}
                      />
                    </div>
                  </div>

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
        )}
      </ImageUploading>
    </div>
  )
}
