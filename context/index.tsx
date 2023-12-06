import { ThemeProvider } from './theme-provider'
import { SmoothScroll } from '/components/smooth-scroll'

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScroll />
      {children}
    </ThemeProvider>
  )
}
