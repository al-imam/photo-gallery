import { SmoothScroll } from '@/components/smooth-scroll'
import sdk from '@/sdk'
import { Toaster } from '@/shadcn/ui/sonner'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'

export async function Provider({ children }: React.PropsWithChildren) {
  const [response] = await sdk.auth.checkAuth()

  const _currentUser = response?.user ?? null
  const _auth = response?.token ?? null

  return (
    <AuthProvider currentUser={_currentUser} auth={_auth}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SmoothScroll />
        <Toaster />
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
