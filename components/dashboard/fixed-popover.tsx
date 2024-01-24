'use client'

import { cn } from '@/shadcn/utils'
import { useEffect, useRef, useState } from 'react'

interface FixedPopoverProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode
}

export function FixedPopover({
  children,
  className,
  ...rest
}: FixedPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIntersecting] = useState(true)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('w-full')}>
      <div
        className={cn(
          'ml-auto mr-[--padding] sm:px-[--padding]',
          {
            'fixed inset-x-0 top-[--padding] z-50 mr-[calc(var(--removed-body-scroll-bar-size,0px)_+_var(--padding))]':
              !isIntersecting,
          },
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  )
}
