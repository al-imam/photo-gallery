'use client'

import { GetData } from '@/app/api/media/route'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { MediaWithLoves } from '@/service/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { PhotosMasonry } from './photos-masonry'

interface InfiniteScrollProps {
  initialItems: MediaWithLoves[]
  cursor: string
  userId: string
}

export function InfiniteScroll({
  initialItems: _initialItems,
  cursor: _cursor,
  userId,
}: Partial<InfiniteScrollProps>) {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')
  const [cursor, setCursor] = useState(_cursor)
  const [items, setItems] = useState<MediaWithLoves[]>(_initialItems ?? [])
  const observerTarget = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !error) {
          try {
            const con = {
              params: { limit: 20 } as Record<string, any>,
              body: {} as Record<string, any>,
            }

            if (cursor) con.params.cursor = cursor
            if (userId) con.params.authorId = userId
            if (search) con.params.search = search

            const { data } = await GET<GetData>('media', con)

            if (data.mediaList.length === 0) {
              setHasMore(false)
            } else {
              setItems((prev) => [...prev, ...data.mediaList])
              setCursor(data.mediaList.at(-1)?.id)
            }
          } catch {
            setError(true)
            toast('Something went wrong!', {
              action: {
                label: 'Try again',
                onClick: () => setError(false),
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
  }, [observerTarget, hasMore, cursor, error, userId, search])

  return (
    <div>
      <PhotosMasonry items={items} />
      <div ref={observerTarget} />
      <div>
        {hasMore ? (
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
