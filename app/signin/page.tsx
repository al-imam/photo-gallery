import { UserSigninForm } from '@/components/form/user-signin-form'
import { NavBar } from '@/components/nav'
import { SigninIllustration } from '@/icons/illustrations'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Signin',
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
            <SigninIllustration className="w-[min(30rem,100%)]" />
          </div>
          <div className="relative my-auto">
            <div className="flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and password below to signin to your account
                </p>
              </div>

              <Suspense>
                <UserSigninForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
