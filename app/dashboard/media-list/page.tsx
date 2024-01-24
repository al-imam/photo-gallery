'use client'

/* eslint-disable no-nested-ternary */

import { GetData } from '@/app/api/media/route'
import { FixedPopover, ModifyMedia, statuses } from '@/components/dashboard'
import { useAuth } from '@/hooks'
import { useCategory } from '@/hooks/category'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { Input } from '@/shadcn/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useMeasure } from 'react-use'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'

export default function MediaList() {
  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const [debounceSearch] = useDebounce(search, 200)
  const [isOpen, setIsOpen] = useState(false)
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { auth } = useAuth()
  const {
    data: { categories },
  } = useCategory()

  const [selectedMedia, setSelectedMedia] = useState<GetData['mediaList'][0]>()

  const { status, data, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<GetData['mediaList']>({
      queryKey: ['media-list-infante-scroll', selected, debounceSearch],

      queryFn: async ({ pageParam, queryKey }) => {
        const res = await GET<GetData>(`media`, {
          params: {
            cursor: pageParam,
            status: queryKey[1] || undefined,
            search: queryKey[2] || undefined,
          },
          headers: {
            Authorization: auth,
          },
        })

        return res.data.mediaList
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        return lastPage.at(-1)?.id
      },
    })

  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          try {
            if (!isFetching) fetchNextPage({ throwOnError: true })
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
    <div className="relative p-[--padding] [scrollbar-gutter:stable]" ref={ref}>
      <div className="mb-4 sm:mb-6">
        <FixedPopover style={{ width: width === 0 ? 'max-w-2xl' : width }}>
          <div className="flex items-center max-w-2xl rounded-sm overflow-hidden mx-auto  bg-muted shadow-sm shadow-muted p-3 gap-2">
            <Input
              placeholder="Search"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
            />
            <Select onValueChange={setSelected} value={selected}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                {statuses.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FixedPopover>
      </div>
      {selectedMedia && (
        <ModifyMedia
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          media={selectedMedia}
          categories={categories}
        />
      )}
      {status === 'pending' ? null : status === 'error' ? (
        <span>Something went wrong!</span>
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
              <Fragment key={index}>
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
              </Fragment>
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
            <span className="font-sans text-sm text-muted-foreground">
              That&apos;s all for now, thanks for exploring!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
