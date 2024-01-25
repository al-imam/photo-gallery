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
  LineChartIcon,
  ListEndIcon,
  ListVideoIcon,
  ListXIcon,
  PanelLeftOpenIcon,
  Users2,
} from 'lucide-react'
import { useSelectedLayoutSegment } from 'next/navigation'
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
  const selected = useSelectedLayoutSegment()

  const tabs = useMemo(
    () => (
      <Fragment>
        <Nav
          isCollapsed={isCollapsed}
          key={0}
          links={[
            {
              title: 'Statics',
              icon: LineChartIcon,
              variant: selected === null ? 'default' : 'ghost',
              href: '',
            },
          ]}
        />
        <Separator key={1} />
        <Nav
          isCollapsed={isCollapsed}
          key={2}
          links={[
            {
              title: 'Media List',
              icon: ListVideoIcon,
              variant: selected === 'media-list' ? 'default' : 'ghost',
              href: 'media-list',
            },
            {
              title: 'Media Update',
              icon: ListEndIcon,
              variant: selected === 'media-update' ? 'default' : 'ghost',
              href: 'media-update',
            },
            {
              title: 'Media Report',
              icon: ListXIcon,
              variant: selected === 'media-report' ? 'default' : 'ghost',
              href: 'media-report',
            },
          ]}
        />
        <Separator key={3} />
        <Nav
          isCollapsed={isCollapsed}
          key={4}
          links={[
            {
              title: 'Users',
              icon: Users2,
              variant: selected === 'users' ? 'default' : 'ghost',
              href: 'users',
            },
            {
              title: 'Collections',
              icon: LibraryIcon,
              variant: selected === 'collections' ? 'default' : 'ghost',
              href: 'collections',
            },
          ]}
        />
      </Fragment>
    ),
    [isCollapsed, selected]
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
