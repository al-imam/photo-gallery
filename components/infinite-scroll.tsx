'use client'

import { GetData } from '@/app/api/media/route'
import { SpinnerIcon } from '@/icons'
import { GET } from '@/lib'
import { MediaWithLoves } from '@/service/types'
import { debounce } from '@/util'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PhotosMasonry1 } from './photos-masonry'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const handleScroll = debounce(async () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

      if (scrollPercentage >= 90 && !loading && !error && hasMore) {
        try {
          setLoading(true)
          const { data } = await GET<GetData>('media', {
            params: { cursor, limit: 20 },
          })

          if (data.media.length === 0) {
            setHasMore(false)
          } else {
            setItems((prev) => [...prev, ...data.media])
            setCursor(data.media.at(-1)?.id)
          }
        } catch (_error) {
          setError(true)
          toast.error('Something went wrong!')
        } finally {
          setLoading(false)
        }
      }
    }, 100)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loading, error, hasMore, cursor])

  return (
    <div>
      <PhotosMasonry1 items={items} />

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
