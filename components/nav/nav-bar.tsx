'use client'

import { cn } from '@/shadcn/utils'
import { useEffect, useRef, useState } from 'react'
import { Brand } from './brand'
import { NavMenu } from './nav-menu'

export function NavBar({ takeHeight = true }) {
  const ref = useRef<HTMLElement>(null)
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
    <nav
      ref={ref}
      className={cn('w-full', { 'mb-[var(--nav-size)]': takeHeight })}
    >
      <div
        className={cn(
          'content fixed inset-x-0 top-0 z-50 border-b duration-200',
          {
            'border-transparent bg-background/0': isIntersecting,
            'bg-background border-muted-foreground/50': !isIntersecting,
          }
        )}
      >
        <div className="flex h-[var(--nav-size)] items-center justify-between">
          <NavMenu className="order-1" />
          <Brand className="order-0" />
        </div>
      </div>
    </nav>
  )
}
