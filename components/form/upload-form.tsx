'use client'

import { MultiSelect } from '@/components/multi-select'
import { ImageFormValues } from '@/context/upload-images'
import { useCategory } from '@/hooks/category'
import { useImageUpload } from '@/hooks/images'
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
  const { submitRefs } = useImageUpload()
  const form = useForm<ImageFormValues>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      category: undefined,
    },
  })

  function onSubmit() {}

  async function submit(
    callback: (value: ImageFormValues) => Promise<void> | void
  ) {
    form.handleSubmit(callback)()
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
                  disabled={form.formState.isSubmitting}
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
                  disabled={form.formState.isSubmitting}
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
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
