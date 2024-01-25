'use client'

import * as React from 'react'

import { useAuth } from '@/hooks'
import { SpinnerIcon } from '@/icons'
import { PATCH } from '@/lib'
import { Button } from '@/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shadcn/ui/drawer'
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
import { cn } from '@/shadcn/utils'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useMedia } from 'react-use'
import { toast } from 'sonner'
import { getMediaUrl } from '@/util'
import { GetData } from '@/app/api/media/route'

interface FormValues {
  status: string
  title: string
  categoryId: string
}

export const statuses = [
  {
    id: 'APPROVED',
    name: 'approved',
  },
  {
    id: 'REJECTED',
    name: 'rejected',
  },
  {
    id: 'PENDING',
    name: 'pending',
  },
]

function ModifyForm({
  className,
  media,
  categories,
  close,
}: React.ComponentProps<'form'> & {
  media: GetData['mediaList'][0]
  categories: any[]
  close: () => void
}) {
  const { auth } = useAuth()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    defaultValues: {
      status: media.status,
      title: media.title,
      categoryId: media.category?.id,
    },
  })

  async function onSubmit(body: FormValues) {
    try {
      await PATCH(`media/${media.id}`, body, {
        headers: { Authorization: auth },
      })
      queryClient.invalidateQueries({ queryKey: ['media-list-infante-scroll'] })
      close()
      return toast.success('Updated successfully!')
    } catch {
      return toast.error('Something went wrong!', {
        action: {
          label: 'Try again',
          onClick: () => {},
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('grid items-start gap-4 mt-2', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <a
          href={getMediaUrl(media.url_media)}
          target="_blank"
          className="max-h-[min(35rem,50vh)] overflow-hidden rounded-sm cursor-pointer"
        >
          <Image
            src={getMediaUrl(media.url_thumbnail)}
            alt={media.title}
            width={media.media_width}
            height={media.media_height}
            style={{ aspectRatio: media.media_width / media.media_height }}
            className="max-h-full max-w-full object-cover"
          />
        </a>
        <FormField
          control={form.control}
          name="status"
          rules={{ required: 'Status is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
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
                  {statuses.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.name}
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
          name="categoryId"
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.name}
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
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save changes
        </Button>
      </form>
    </Form>
  )
}

interface ModifyMediaProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  media: GetData['mediaList'][0]
  categories: any[]
}

export function ModifyMedia({
  isOpen,
  onOpenChange,
  media,
  categories,
}: ModifyMediaProps) {
  const isDesktop = useMedia('(min-width: 768px)', false)

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Modify Media</DialogTitle>
          </DialogHeader>

          <ModifyForm
            media={media}
            categories={categories}
            close={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Modify Media</DrawerTitle>
        </DrawerHeader>
        <ModifyForm
          className="px-4"
          media={media}
          categories={categories}
          close={() => onOpenChange(false)}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
