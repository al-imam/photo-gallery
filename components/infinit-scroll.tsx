'use client'

/* eslint-disable no-bitwise */
import { SpinnerIcon } from '@/icons'
import { random } from '@/lib'
import { useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'
import { PhotoCard } from './photo-card'

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const InfiniteScrollList = () => {
  const [hasMore] = useState(true)
  const [items, setItems] = useState(
    Array.from({ length: 10 }).map((_, i) => ({
      id: generateUUID(),
      color: getRandomColor(),
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
              id: generateUUID(),
              color: getRandomColor(),
              aspectRatio: random(4, 6) / random(3, 6),
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
          <PhotoCard
            key={item.id}
            photoURL={`https://source.unsplash.com/random/${random(
              10,
              30
            )}x${random(10, 30)}`}
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

export default InfiniteScrollList
