import { Toaster } from 'sonner'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { SmoothScroll } from '/components/smooth-scroll'
import sdk from '/sdk'

export async function Provider({ children }: React.PropsWithChildren) {
  const [currentUser, auth] = (await sdk.auth.checkAuth()) as any

  return (
    <AuthProvider currentUser={currentUser} auth={auth}>
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
