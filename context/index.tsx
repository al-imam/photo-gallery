import sdk from '@/sdk'
import { Toaster } from '@/shadcn/ui/sonner'
import { AuthProvider } from './auth-provider'
import { QueryProvider } from './query-provider'
import { ScrollProvider } from './scroll-provider'
import { ThemeProvider } from './theme-provider'

export async function Provider({ children }: React.PropsWithChildren) {
  const [response] = await sdk.auth.checkAuth()

  const _currentUser = response?.user ?? null
  const _auth = response?.token ?? null

  return (
    <QueryProvider>
      <AuthProvider currentUser={_currentUser} auth={_auth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProvider>
            <Toaster />
            {children}
          </ScrollProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
