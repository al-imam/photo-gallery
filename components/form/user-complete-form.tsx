'use client'

import { Password } from '@/components/form/password'
import { useAuth } from '@/hooks'
import { SpinnerIcon } from '@/icons'
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
import { decode, emailRegex } from '@/util'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
  const { signUpComplete } = useAuth()
  const qp = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const _token = qp.get('token')
    if (!_token) return router.replace('/signup')

    const decoded = decode(_token)

    if (decoded.payload && emailRegex.test(decoded.payload.toString())) {
      setToken(_token)
      return form.setValue('email', decoded.payload.toString())
    }

    return router.replace('/signup')
  }, [])

  async function onSubmit({ password }: FormValues) {
    if (!token) return router.replace('/signup')
    const [_, error] = await signUpComplete({ password, token })

    if (error) return toast.error('Something went wrong!')
    toast.success("Welcome you're in!")

    return router.replace(qp.get('callbackURL') ?? '/')
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
                    <Password placeholder="Password" {...field} />
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
                    <Password placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting}>
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
