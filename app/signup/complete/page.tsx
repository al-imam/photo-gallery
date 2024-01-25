import { UserCompleteForm } from '@/components/form/user-complete-form'
import { NavBar } from '@/components/nav'
import { SignupCompleteIllustration } from '@/icons/illustrations'
import { decode, emailRegex } from '@/util'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Complete Signup',
}

export default async function Complete({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const auth = searchParams.token
  if (!auth) return redirect('/signup')
  const decoded = decode(auth)
  if (!decoded.payload || !emailRegex.test(decoded.payload.toString())) {
    return redirect('/signup')
  }

  return (
    <div className="bg-background">
      <NavBar takeHeight={false} />
      <div className="content">
        <div className="flex min-h-screen [&>*]:flex-1 gap-8">
          <div className="stack-content hidden lg:grid w-full overflow-hidden place-items-center">
            <SignupCompleteIllustration className="w-[min(30rem,100%)]" />
          </div>
          <div className="relative my-auto">
            <div className="flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Complete your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your password below to create your account
                </p>
              </div>
              <UserCompleteForm
                email={decoded.payload.toString()}
                auth={auth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
