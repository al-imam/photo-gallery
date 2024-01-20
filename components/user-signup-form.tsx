'use client'

import { useAuth } from '@/hooks'
import { GoogleIcon, SpinnerIcon } from '@/icons'
import { Button, buttonVariants } from '@/shadcn/ui/button'
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
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
    if (error) return toast.error('Something went wrong')
    toast.success('Check your mail, you have 5 minuets', { duration: 10000 })
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
                    <Input placeholder="Email" {...field} />
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
      <a href="#" className={buttonVariants({ variant: 'outline' })}>
        <GoogleIcon className="mr-2 h-4 w-4" /> Google
      </a>
    </div>
  )
}
