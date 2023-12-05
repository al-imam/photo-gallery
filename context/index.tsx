import { SmoothScroll } from "$components/smooth-scroll";
import { ThemeProvider } from "./theme-provider";

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SmoothScroll />
      {children}
    </ThemeProvider>
  );
}
