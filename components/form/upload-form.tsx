'use client'

import { MultiSelect } from '@/components/multi-select'
import { ImageFormValues } from '@/context/upload-images'
import { useCategory } from '@/hooks/category'
import { useImageUpload } from '@/hooks/images'
import { Button } from '@/shadcn/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'

import { useForm } from 'react-hook-form'

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

export function ImageForm({ id }: { id: string }) {
  const { data } = useCategory()
  const { submitRefs, isAllSubmitting } = useImageUpload()
  const form = useForm<ImageFormValues>({
    defaultValues: {
      title: '',
      category: '',
      description: '',
      tags: [],
    },
  })

  function onSubmit() {}

  async function submit(
    callback: (value: ImageFormValues) => Promise<void> | void
  ) {
    await form.handleSubmit(callback)()
    return form.reset
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        ref={(el) => {
          if (el) {
            submitRefs.current = {
              ...submitRefs.current,
              [id]: submit,
            }
          } else if (submitRefs.current[id]) {
            delete submitRefs.current[id]
          }
        }}
      >
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting || isAllSubmitting}
                  placeholder="Title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting || isAllSubmitting}
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          rules={{}}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={form.formState.isSubmitting || isAllSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <Button
                    variant="ghost"
                    className={'w-full ps-8 justify-start'}
                    onClick={() => form.setValue('category', '')}
                  >
                    None
                  </Button>

                  {data.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Create tags"
                  items={photoTags}
                  selected={form.getValues('tags')}
                  limit={5}
                  disabled={form.formState.isSubmitting || isAllSubmitting}
                  setSelected={(set) =>
                    typeof set === 'function'
                      ? field.onChange(set(form.getValues('tags')))
                      : field.onChange(set)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
