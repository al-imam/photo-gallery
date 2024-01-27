import { ImageForm } from '@/components/form/upload-form'
import { useImageUpload } from '@/hooks/images'
import { Button } from '@/shadcn/ui/button'
import { ImageType } from 'react-images-uploading'

export function UploadImage({
  image,
  index,
}: {
  image: ImageType
  index: number
}) {
  const { onImageRemove, onImageUpdate } = useImageUpload()

  return (
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
      <ImageForm />
    </div>
  )
}
