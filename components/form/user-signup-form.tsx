'use client'

import { useAuth } from '@/hooks'
import { GoogleIcon, SpinnerIcon } from '@/icons'
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
import { emailRegex } from '@/util'
import googleAuth from '@/util/google'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getErrorMessage } from '../../util/error-message'

interface UserSignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormValues {
  email: string
}

export function UserSignupForm({ className, ...props }: UserSignupFormProps) {
  const { signUp } = useAuth()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit({ email }: FormValues) {
    const [_, error] = await signUp({ email })
    if (error) return toast.error(getErrorMessage(error))
    toast.success('Check your mail for sign-up link', { duration: 10000 })
    return form.reset()
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
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
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Signup
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={() => googleAuth()}>
        <GoogleIcon className="mr-2 h-4 w-4" /> Google
      </Button>
    </div>
  )
}
