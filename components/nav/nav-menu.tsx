'use client'

import { useAuth } from '@/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar'
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
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { toast } from 'sonner'

const ghostFocus =
  'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0'

interface NavMenuProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function NavMenu({ className, ...rest }: NavMenuProps) {
  const { setTheme } = useTheme()
  const path = usePathname()
  const { currentUser, signOut } = useAuth()
  const isAuthenticated = !!currentUser

  const signupPage = path.endsWith('/signup')

  return (
    <div className={cn('flex gap-1 justify-center', className)} {...rest}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(ghostFocus, 'hidden sm:inline-flex')}
          >
            Explore
            <ChevronDown className="w-4 h-4" />
            <span className="sr-only">dropdown</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem asChild>
            <Link href="/top-rated" className="hover:cursor-pointer">
              Top rated
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/category" className="hover:cursor-pointer">
              Category
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/upload"
        className={cn(
          buttonVariants({
            variant: 'ghost',
            className: cn(ghostFocus),
          })
        )}
      >
        Upload
      </Link>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {isAuthenticated ? (
            <button className="[all:unset] group cursor-pointer">
              <Avatar className="group-focus:ring-4 ring-foreground ml-1 cursor-pointer">
                <AvatarImage
                  src={currentUser.avatar_sm ?? ''}
                  alt={currentUser.name}
                />
                <AvatarFallback>
                  {currentUser.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={cn(ghostFocus, 'rotate-90 sm:rotate-0')}
            >
              <MoreHorizontal className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">dropdown</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {isAuthenticated && (
            <Fragment>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="hover:cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/photos" className="hover:cursor-pointer">
                  Photos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/collections" className="hover:cursor-pointer">
                  Collections
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/loved-photos" className="hover:cursor-pointer">
                  Loved Photos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </Fragment>
          )}

          <div className="sm:hidden">
            {isAuthenticated || (
              <Fragment>
                <DropdownMenuItem asChild>
                  <Link
                    href={signupPage ? '/signin' : '/signup'}
                    className="hover:cursor-pointer"
                  >
                    {signupPage ? 'Signin' : 'Signup'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </Fragment>
            )}
            <DropdownMenuItem asChild>
              <Link href="/top-rated" className="hover:cursor-pointer">
                Top rated
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/category" className="hover:cursor-pointer">
                Category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </div>

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
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className="cursor-pointer"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className="cursor-pointer"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className="cursor-pointer"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {isAuthenticated && (
            <DropdownMenuItem asChild>
              <Link href="/settings" className="hover:cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/support" className="hover:cursor-pointer">
              Support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/about-us" className="hover:cursor-pointer">
              About Us
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/terms-of-service" className="hover:cursor-pointer">
              Terms of service
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/privacy-policy" className="hover:cursor-pointer">
              Privacy policy
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/learn-more" className="hover:cursor-pointer">
              Learn more
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isAuthenticated && (
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  onError() {
                    toast.error('Unable to sign out at the moment.')
                  },
                  onSuccess() {
                    toast.success('You have been securely signed out.')
                  },
                })
              }
              className="cursor-pointer"
            >
              Signout
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAuthenticated || (
        <Link
          href={signupPage ? '/signin' : '/signup'}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: cn(ghostFocus, 'hidden sm:inline-flex'),
            })
          )}
        >
          {signupPage ? 'Signin' : 'Signup'}
        </Link>
      )}
    </div>
  )
}
