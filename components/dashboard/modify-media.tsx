'use client'

import * as React from 'react'

import { GetData } from '@/app/api/media/route'
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
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useMedia } from 'react-use'

interface FormValues {
  status: string
  title: string
}

const statuses = [
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

function ProfileForm({
  className,
  media,
}: React.ComponentProps<'form'> & { media: GetData['mediaList'][0] }) {
  const form = useForm<FormValues>({
    defaultValues: {
      status: media.status,
      title: media.title,
    },
  })

  function onSubmit(_value: FormValues) {}

  return (
    <Form {...form}>
      <form
        className={cn('grid items-start gap-4 mt-2', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <a
          href={`/api/yandex-disk/media/${media.url_media}`}
          target="_blank"
          className="max-h-[min(35rem,50vh)] overflow-hidden rounded-sm cursor-pointer"
        >
          <Image
            src={`/api/yandex-disk/media/${media.url_thumbnail}`}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
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

        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  )
}

interface ModifyMediaProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  media: GetData['mediaList'][0]
}

export function ModifyMedia({ isOpen, onOpenChange, media }: ModifyMediaProps) {
  const isDesktop = useMedia('(min-width: 768px)', false)

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Modify Media</DialogTitle>
          </DialogHeader>

          <ProfileForm media={media} />
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
        <ProfileForm className="px-4" media={media} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
