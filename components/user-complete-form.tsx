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
import { SpinnerIcon } from '/icons'

interface UserCompleteFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormValues {
  email: string
  password: string
  confirmPassword: string
}

export function UserCompleteForm({
  className,
  ...props
}: UserCompleteFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const form = useForm<FormValues>()

  async function onSubmit() {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
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
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  message: 'Password must be at least 6 characters',
                  value: 6,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: 'Confirm Password is required',
                validate: (value) => {
                  if (value !== form.getValues('password'))
                    return 'Password does not match'
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="mt-1">
              {isLoading && (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
