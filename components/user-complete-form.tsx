'use client'

import { Button } from '@/shadcn/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import { cn } from '@/shadcn/utils'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SpinnerIcon } from '@/icons'
import { decode, emailRegex } from '@/util'

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
  const qp = useSearchParams()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const token = qp.get('token')
    if (!token) return

    const decoded = decode(token)

    if (decoded.payload && emailRegex.test(decoded.payload.toString())) {
      return form.setValue('email', decoded.payload.toString())
    }

    redirect('/signup')
  }, [])

  async function onSubmit() {
    await new Promise((r) => {
      setTimeout(() => {
        r(0)
        redirect(qp.get('callbackURL') ?? '/')
      }, 3000)
    })
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
            <Button disabled={form.formState.isSubmitting} className="mt-1">
              {form.formState.isSubmitting && (
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
