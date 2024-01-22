import { cn } from '@/shadcn/utils'
import Link from 'next/link'

interface BrandProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function Brand({ className, ...rest }: BrandProps) {
  return (
    <div className={cn(className)} {...rest}>
      <Link href="/" className="cursor-pointer">
        <div className="h-10 w-10 bg-amber-500 rounded" />
      </Link>
    </div>
  )
}
