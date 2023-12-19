'use client'

import { Button, buttonVariants } from '@/shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu'
import { cn } from '@/shadcn/utils'
import { ChevronDown, Moon, MoreHorizontal, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const ghostFocus =
  'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0'

export function NavBar({ takeHeight = true }) {
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIntersecting] = useState(true)
  const { setTheme } = useTheme()

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
          <div className="order-1 flex gap-1 justify-center">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 gap-1"
                >
                  Explore
                  <ChevronDown className="w-4 h-4" />
                  <span className="sr-only">dropdown</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/explore-1" className="hover:cursor-pointer">
                    Explore-1
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/explore-2" className="hover:cursor-pointer">
                    Explore-2
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/explore-3" className="hover:cursor-pointer">
                    Explore-3
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/explore-4" className="hover:cursor-pointer">
                    Explore-4
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Sub-1</DropdownMenuItem>
                      <DropdownMenuItem>Sub-2</DropdownMenuItem>
                      <DropdownMenuItem>Sub-3</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/join"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: ghostFocus,
                })
              )}
            >
              License
            </Link>

            <Link
              href="/join"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: ghostFocus,
                })
              )}
            >
              Upload
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <MoreHorizontal className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">dropdown</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/Link-1" className="hover:cursor-pointer">
                    Link-1
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/link-2" className="hover:cursor-pointer">
                    Link-2
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/link-3" className="hover:cursor-pointer">
                    Link-3
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <p className="flex items-center gap-2">
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span>Theme</span>
                    </p>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/join"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: ghostFocus,
                })
              )}
            >
              Join
            </Link>
          </div>

          <div className="order-0">
            <div className="h-10 w-10 bg-amber-500 rounded" />
          </div>
        </div>
      </div>
    </nav>
  )
}
