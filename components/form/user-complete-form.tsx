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
import { emailRegex } from '@/util'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UserCompleteFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string
  auth: string
}

interface FormValues {
  email: string
  password: string
  confirmPassword: string
}

export function UserCompleteForm({
  className,
  auth,
  email,
  ...props
}: UserCompleteFormProps) {
  const { signUpComplete } = useAuth()
  const qp = useSearchParams()
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit({ password }: FormValues) {
    const [_, error] = await signUpComplete({ password, token: auth })

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
                    <Password
                      disabled={form.formState.isSubmitting}
                      placeholder="Password"
                      {...field}
                    />
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
                    <Password
                      disabled={form.formState.isSubmitting}
                      placeholder="Confirm Password"
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
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
