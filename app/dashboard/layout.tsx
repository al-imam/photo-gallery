'use client'

import { Nav } from '@/components/dashboard/nav'
import { Brand, NavMenu } from '@/components/nav'
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
  LibraryIcon,
  ListEndIcon,
  ListVideoIcon,
  ListXIcon,
  PanelLeftOpenIcon,
  Users2,
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { useMedia } from 'react-use'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isWide = useMedia('(min-width: 640px)', true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const tabs = useMemo(
    () => (
      <Fragment>
        <Nav
          isCollapsed={isCollapsed}
          key={0}
          links={[
            {
              title: 'Media List',
              label: '128',
              icon: ListVideoIcon,
              variant: 'default',
            },
            {
              title: 'Media Update',
              label: '9',
              icon: ListEndIcon,
              variant: 'ghost',
            },
            {
              title: 'Media Report',
              label: '',
              icon: ListXIcon,
              variant: 'ghost',
            },
          ]}
        />
        <Separator key={1} />
        <Nav
          isCollapsed={isCollapsed}
          key={2}
          links={[
            {
              title: 'Users',
              label: '972',
              icon: Users2,
              variant: 'ghost',
            },
            {
              title: 'Collections',
              label: '342',
              icon: LibraryIcon,
              variant: 'ghost',
            },
          ]}
        />
      </Fragment>
    ),
    [isCollapsed]
  )

  return (
    <Fragment>
      <div className="flex h-[var(--nav-size)] items-center justify-between px-4">
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
      <Separator />
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            if (sizes[0] === 4) {
              setIsCollapsed(true)
            } else {
              setIsCollapsed(false)
            }
          }}
          className="min-h-[calc(100vh-(var(--nav-size)+1px))] items-stretch"
        >
          {isWide ? (
            <Fragment>
              <ResizablePanel
                collapsedSize={4}
                collapsible={true}
                minSize={15}
                maxSize={20}
                order={0}
                id="panel-sidebar"
                style={{
                  maxWidth: '24rem',
                  minWidth: isCollapsed ? '3.125rem' : '12rem',
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
            <main className="[--padding:1rem] sm:[--pacing:2rem]">
              {children}
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </Fragment>
  )
}
