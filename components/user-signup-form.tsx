'use client'

import { Button } from '$shadcn/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '$shadcn/ui/form'
import { Input } from '$shadcn/ui/input'
import { cn } from '$shadcn/utils'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuth } from '/hooks'
import { SpinnerIcon } from '/icons'
import { emailRegex } from '/util'

interface UserSignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormValues {
  email: string
}

export function UserSignupForm({ className, ...props }: UserSignupFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  })
  const { signUp } = useAuth()

  async function onSubmit({ email }: FormValues) {
    const [_, error] = await signUp({ email })
    if (error) return toast.error('Something went wrong')
    toast.success('Check your mail, you have 5 minuets', { duration: 10000 })
    form.reset()
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  message: 'Please enter a valid email address',
                  value: emailRegex,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} className="mt-1">
              {form.formState.isSubmitting && (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Signup
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
