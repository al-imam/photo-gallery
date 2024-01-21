'use client'

import { Password } from '@/components/form/password'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { POST } from '@/lib'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shadcn/ui/alert-dialog'
import axios from 'axios'
import { useState } from 'react'

interface UserSigninFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormValues {
  email: string
  password: string
}

export function UserSigninForm({ className, ...props }: UserSigninFormProps) {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const qp = useSearchParams()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(value: FormValues) {
    const [_, error] = await signIn(value)

    if (error) return toast.error('Invalid email and password!')
    toast.success('Welcome back, nice to see you again!')

    return router.replace(qp.get('callbackURL') ?? '/')
  }

  async function resetPasswordOpen(value: boolean) {
    if (!value) setIsResetPasswordOpen(true)
    if (await form.trigger('email')) return setIsResetPasswordOpen(value)
    form.setFocus('email')
  }

  async function resetPassword() {
    setIsLoading(true)
    try {
      await POST('auth/reset-password', { email: form.getValues('email') })
      toast.success('Password reset email sent!')
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.error === 'No User found'
      ) {
        toast.error('No user found with that email!')
      } else {
        toast.error('Something went wrong!')
      }
    } finally {
      setIsLoading(false)
      setIsResetPasswordOpen(false)
    }
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

            <AlertDialog
              onOpenChange={resetPasswordOpen}
              open={isResetPasswordOpen}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground -mt-1 py-[2px] ml-auto font-medium text-right"
                >
                  Having trouble remembering your password?
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Click <span className="font-semibold">Continue</span> to
                    initiate the password reset for{' '}
                    <span className="font-semibold">
                      {form.getValues('email')}
                    </span>
                    . You will receive an email containing instructions on the
                    next steps to complete the process.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <Button type="button" onClick={resetPassword}>
                    {isLoading && (
                      <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Continue
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Signin
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
