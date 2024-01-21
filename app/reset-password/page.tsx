import { ResetPasswordForm } from '@/components/form/reset-password-form'
import { NavBar } from '@/components/nav-bar'
import { ResetPasswordIllustration } from '@/icons/illustrations'
import { decode } from '@/util/jwt'
import { emailRegex } from '@/util/regex'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'account recovery',
}

export default async function ResetPassword({
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
            <ResetPasswordIllustration className="w-[min(30rem,100%)]" />
          </div>
          <div className="relative my-auto">
            <div className="flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Account Recovery
                </h1>
                <p className="text-sm text-muted-foreground [text-wrap:balance]">
                  Enter your new password below to complete the password reset
                  process.
                </p>
              </div>
              <ResetPasswordForm
                auth={auth}
                email={decoded.payload.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
