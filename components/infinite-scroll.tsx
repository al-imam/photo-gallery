'use client'

import { GetData } from '@/app/api/media/route'
import { PhotoCard } from '@/components/photo-card'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { MediaWithLoves } from '@/service/types'
import { useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'
import { toast } from 'sonner'

interface InfiniteScrollProps {
  initialItems: MediaWithLoves[]
  cursor?: string
}

export function InfiniteScroll({
  initialItems: _initialItems,
  cursor: _cursor,
}: InfiniteScrollProps) {
  const [hasMore] = useState(true)
  const [cursor, setCursor] = useState(_cursor)
  const [items, setItems] = useState<MediaWithLoves[]>(_initialItems)

  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          try {
            const { data } = await GET<GetData>('media', { params: { cursor } })
            setItems((prev) => [...prev, ...data.media])
            setCursor(data.media.at(-1)?.id)
          } catch (error) {
            toast.error('Something went wrong!')
          }
        }
      },
      { threshold: 1, rootMargin: '200px 0px' }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, hasMore, cursor])

  return (
    <div className="[--gap-img:1rem]">
      <Masonry
        className="flex ml-[calc(var(--gap-img)*-1)] w-auto"
        columnClassName="pl-[--gap-img] bg-clip-padding [&>*]:mb-[--gap-img]"
        breakpointCols={{
          default: 3,
          1024: 2,
          640: 1,
        }}
      >
        {items.map((item) => (
          <PhotoCard key={item.id} {...item} />
        ))}
      </Masonry>
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
