'use client'

/* eslint-disable no-nested-ternary */

import { GetData } from '@/app/api/media/route'
import { ModifyMedia } from '@/components/dashboard'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as React from 'react'
import { toast } from 'sonner'

export default function MediaList() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedMedia, setSelectedMedia] =
    React.useState<GetData['mediaList'][0]>()
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
    <div className="p-[--padding]">
      {selectedMedia && (
        <ModifyMedia
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          media={selectedMedia}
        />
      )}
      {status === 'pending' ? null : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Author</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.map((media) => (
                  <TableRow
                    key={media.id}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(media)
                      setIsOpen(true)
                    }}
                  >
                    <TableCell className="hidden sm:table-cell w-max text-nowrap max-w-52 text-ellipsis overflow-hidden">
                      {media.author.name}
                    </TableCell>
                    <TableCell className="font-medium w-max text-nowrap max-w-xs text-ellipsis overflow-hidden">
                      {media.title}
                    </TableCell>
                    <TableCell className="w-max text-nowrap max-w-xs text-ellipsis overflow-hidden">
                      {media.category?.name}
                    </TableCell>
                    <TableCell className="text-right w-max text-nowrap max-w-xs text-ellipsis overflow-hidden lowercase">
                      {media.status}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
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
    </div>
  )
}
