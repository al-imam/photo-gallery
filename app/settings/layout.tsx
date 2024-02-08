'use client'

import { Brand, NavMenu } from '@/components/nav'
import { Nav } from '@/components/nav/nav'
import { Button } from '@/shadcn/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shadcn/ui/resizable'
import { Separator } from '@/shadcn/ui/separator'
import { Sheet, SheetContent } from '@/shadcn/ui/sheet'
import { TooltipProvider } from '@/shadcn/ui/tooltip'
import { cn } from '@/shadcn/utils'
import {
  PanelLeftOpenIcon,
  SettingsIcon,
  UserCogIcon,
  UserIcon,
} from 'lucide-react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'
import { useMedia } from 'react-use'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isWide = useMedia('(min-width: 768px)', true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const selected = useSelectedLayoutSegment()

  const tabs = useMemo(
    () => (
      <Nav
        isCollapsed={isCollapsed}
        key={0}
        className={cn('pl-0 ', {
          'group-[[data-collapsed=true]]:px-0 mr-auto': isCollapsed,
        })}
        links={[
          {
            title: 'Settings',
            icon: SettingsIcon,
            variant: selected === null ? 'default' : 'ghost',
            href: '/settings',
          },
          {
            title: 'Profile',
            icon: UserIcon,
            variant: selected === 'profile' ? 'default' : 'ghost',
            href: '/settings/profile',
          },
          {
            title: 'Account',
            icon: UserCogIcon,
            variant: selected === 'account' ? 'default' : 'ghost',
            href: '/settings/account',
          },
        ]}
      />
    ),
    [isCollapsed, selected]
  )

  return (
    <div className="content h-screen">
      <div className="flex h-[var(--nav-size)] items-center justify-between">
        <NavMenu className="order-1" />
        {isWide ? (
          <Brand />
        ) : (
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => setIsOpen(true)}
          >
            <PanelLeftOpenIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator className="content-expand" />
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          style={{ height: 'calc(100vh - (var(--nav-size) + 1px))' }}
          onLayout={(sizes: number[]) => {
            if (sizes[0] === 4) {
              setIsCollapsed(true)
            } else {
              setIsCollapsed(false)
            }
          }}
          className="items-stretch"
        >
          {isWide ? (
            <Fragment>
              <ResizablePanel
                collapsedSize={4}
                collapsible={true}
                minSize={12}
                maxSize={20}
                order={0}
                id="panel-sidebar"
                style={{
                  maxWidth: '24rem',
                  minWidth: isCollapsed ? '3.125rem' : '10rem',
                  minHeight: '100%',
                }}
                className={cn({
                  'min-w-[50px] transition-all duration-300 ease-in-out':
                    isCollapsed,
                })}
              >
                {tabs}
              </ResizablePanel>
              <ResizableHandle withHandle />
            </Fragment>
          ) : (
            <Sheet onOpenChange={setIsOpen} open={isOpen && !isWide}>
              <SheetContent side={'left'} className="px-2">
                <div className="mt-4" />
                {tabs}
              </SheetContent>
            </Sheet>
          )}

          <ResizablePanel minSize={80} id="panel-main-content" order={1}>
            <main
              className="pt-[calc(var(--padding-inline)*2)] md:pl-[--padding-inline] h-full overflow-y-scroll no-scrollbar"
              onWheel={(e) => e.stopPropagation()}
            >
              {children}
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}
