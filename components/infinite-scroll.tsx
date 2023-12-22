'use client'

import { SpinnerIcon } from '@/icons'
import { random } from '@/lib'
import { getColor, getId } from '@/util'
import { useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'

export function InfiniteScroll() {
  const [hasMore] = useState(true)
  const [items, setItems] = useState(
    Array.from({ length: 10 }).map((_, i) => ({
      id: getId(),
      color: getColor(),
      aspectRatio: random(2, 6) / random(2, 6),
      num: i + 1,
    }))
  )

  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          await new Promise((r) => {
            setTimeout(r, 2000)
          })
          setItems((prev) => [
            ...prev,
            ...Array.from({ length: 10 }).map((_, i) => ({
              id: getId(),
              color: getColor(),
              aspectRatio: random(4, 6) / random(4, 6),
              num: i + prev.length + 1,
            })),
          ])
        }
      },
      { threshold: 1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, hasMore])

  return (
    <div className="[--gap-img:1rem]">
      <Masonry
        breakpointCols={{
          default: 3,
          1024: 2,
          640: 1,
        }}
        className="flex ml-[calc(var(--gap-img)*-1)] w-auto"
        columnClassName="pl-[--gap-img] bg-clip-padding [&>*]:mb-[--gap-img]"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded"
            style={{
              backgroundColor: item.color,
              aspectRatio: item.aspectRatio,
            }}
          />
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
