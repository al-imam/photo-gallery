'use client'

import { motion, useMotionTemplate, useSpring } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'

export const Card: React.FC<React.PropsWithChildren> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useLayoutEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect()
      mouseX.set(Math.floor(width / Math.floor(Math.random() * 2 + 1)))
      mouseY.set(Math.floor(height / Math.floor(Math.random() * 2 + 1)))
    }
  }, [cardRef])

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      className="group relative overflow-hidden rounded-xl border border-muted-foreground/50 duration-700 hover:border-foreground/50 hover:bg-background/10 md:gap-8"
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br via-muted-foreground/10 opacity-100 transition duration-1000 group-hover:opacity-50 "
          style={{ maskImage, WebkitMaskImage: maskImage }}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        />
      </div>

      {children}
    </div>
  )
}
