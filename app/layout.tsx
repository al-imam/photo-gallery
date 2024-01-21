import { Provider } from '@/context'
import '@/styles/global.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LocalFont from 'next/font/local'

export const metadata: Metadata = {
  title: {
    default: 'Palestine',
    template: '%s | palestine',
  },
}

const mark = LocalFont({
  src: '../public/fonts/mark-pro-font/mark-pro-heavy.otf',
  variable: '--font-mark-pro',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: true,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={[inter.variable, mark.variable].join(' ')}>
      <body
        className={`bg-background ${
          process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
        }`}
      >
        <div className="fixed bottom-0 right-0 left-0 z-50 w-full h-[0.1rem] scroll-progress rounded-full opacity-50 backdrop-blur-md" />
        {/* <Provider>{children}</Provider> */}
      </body>
    </html>
  )
}
