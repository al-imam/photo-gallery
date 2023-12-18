import { Toaster } from 'sonner'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { SmoothScroll } from '/components/smooth-scroll'

export async function Provider({ children }: React.PropsWithChildren) {
  const { currentUser, auth } = await new Promise<{
    currentUser: null
    auth: null
  }>((resolve) => {
    setTimeout(() => resolve({ currentUser: null, auth: null }), 1000)
  })

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
