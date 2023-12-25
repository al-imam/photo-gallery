'use client'

import { GetData } from '@/app/api/media/route'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { MediaWithLoves } from '@/service/types'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { PhotosMasonry } from './photos-masonry'

interface InfiniteScrollProps {
  initialItems: MediaWithLoves[]
  cursor?: string
}

export function InfiniteScroll({
  initialItems: _initialItems,
  cursor: _cursor,
}: InfiniteScrollProps) {
  const [hasMore, setHasMore] = useState(_initialItems?.length >= 50)
  const [cursor, setCursor] = useState(_cursor)
  const [items, setItems] = useState<MediaWithLoves[]>(_initialItems)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !error) {
          try {
            const { data } = await GET<GetData>('media', {
              params: { cursor, limit: 20 },
            })

            if (data.media.length === 0) {
              setHasMore(false)
            } else {
              setItems((prev) => [...prev, ...data.media])
              setCursor(data.media.at(-1)?.id)
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
  }, [observerTarget, hasMore, cursor, error])

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
            <span className="font-sans text-lg text-muted-foreground">
              Nothing left
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
