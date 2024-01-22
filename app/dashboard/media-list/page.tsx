'use client'

/* eslint-disable no-nested-ternary */

import { GetData } from '@/app/api/media/route'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { ScrollArea, ScrollBar } from '@/shadcn/ui/scroll-area'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as React from 'react'
import { toast } from 'sonner'

export default function MediaList() {
  const { status, data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<GetData['mediaList']>({
      queryKey: ['media-list-infante-scroll'],
      queryFn: async ({ pageParam }) => {
        const res = await GET<GetData>(`media`, {
          params: { cursor: pageParam },
        })
        return res.data.mediaList
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        return lastPage.at(-1)?.id
      },
    })

  const observerTarget = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          try {
            if (!isFetching) fetchNextPage()
          } catch {
            toast('Something went wrong!', {
              action: {
                label: 'Try again',
                onClick: () => fetchNextPage(),
              },
            })
          }
        }
      },
      { threshold: 1, rootMargin: '1000px 0px' }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, isFetching])

  return (
    <ScrollArea className="h-[calc(100vh-(var(--nav-size)+1px))] p-[--padding]">
      {status === 'pending' ? null : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((media) => (
              <p
                key={media.id}
                className="mb-4"
                style={{
                  border: '1px solid gray',
                  borderRadius: '5px',
                  padding: '5rem 1rem',
                  background: `hsla(${Math.floor(Math.random() * 360)}, 60%, 80%, 1)`,
                }}
              >
                {media.title}
              </p>
            ))}
          </React.Fragment>
        ))
      )}

      <div ref={observerTarget} />
      <div>
        {hasNextPage || isFetching ? (
          <div className="mx-auto py-20 flex justify-center items-center text-foreground">
            <SpinnerIcon className="mr-2 h-8 w-8 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <div className="mx-auto py-20 flex justify-center items-center text-foreground">
            <span className="font-sans text-lg text-muted-foreground">
              Nothing left
            </span>
          </div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
