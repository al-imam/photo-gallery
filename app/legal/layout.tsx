import { NavBar } from '@/components/nav'

export default function ThemePreviewPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavBar />

      <div>{children}</div>
    </div>
  )
}
