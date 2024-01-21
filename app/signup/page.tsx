import { UserSignupForm } from '@/components/form/user-signup-form'
import { NavBar } from '@/components/nav-bar'
import { SignupIllustration } from '@/icons/illustrations'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Signup',
}

export default async function Signin({
  searchParams: _,
}: {
  searchParams: Record<string, string>
}) {
  return (
    <div className="bg-background">
      <NavBar takeHeight={false} />
      <div className="content">
        <div className="flex min-h-screen [&>*]:flex-1 gap-8">
          <div className="stack-content hidden lg:grid w-full overflow-hidden place-items-center">
            <SignupIllustration className="w-[min(30rem,100%)]" />
          </div>
          <div className="relative my-auto">
            <div className="flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <UserSignupForm />
              <p className="text-center text-sm text-muted-foreground">
                By clicking signup, you agree to our{' '}
                <Link
                  href="/terms-of-service"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
