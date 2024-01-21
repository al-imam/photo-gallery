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

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string
  auth: string
}

interface FormValues {
  email: string
  newPassword: string
  confirmPassword: string
}

export function ResetPasswordForm({
  className,
  email,
  auth,
  ...props
}: ResetPasswordFormProps) {
  const { resetPassword } = useAuth()

  const qp = useSearchParams()
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues: {
      email,
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit({ newPassword }: FormValues) {
    const [_, error] = await resetPassword({ newPassword, token: auth })
    if (error) return toast.error('Something went wrong!')

    toast.success('Password reset successful!')
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
              name="newPassword"
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
                    <Password placeholder="New password" {...field} />
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
                  if (value !== form.getValues('newPassword'))
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
