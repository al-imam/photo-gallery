'use client'

import { useForm } from 'react-hook-form'

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

import { Textarea } from '@/shadcn/ui/textarea'

export function ProfileForm() {
  const formName = useForm({
    defaultValues: { name: '' },
  })

  const formBio = useForm({
    defaultValues: {
      bio: 'I own a computer.',
    },
  })

  function onSubmitName() {}
  function onSubmitBio() {}

  return (
    <div className="flex flex-col gap-8">
      <Form {...formName}>
        <form
          onSubmit={formName.handleSubmit(onSubmitName)}
          className="space-y-3"
        >
          <FormField
            control={formName.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size={'sm'} type="submit">
            Save
          </Button>
        </form>
      </Form>

      <Form {...formBio}>
        <form
          onSubmit={formBio.handleSubmit(onSubmitBio)}
          className="space-y-3"
        >
          <FormField
            control={formBio.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size={'sm'} type="submit">
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
