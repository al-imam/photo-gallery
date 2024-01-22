'use client'

import { Prettify } from '@/types'
import Lenis from '@studio-freight/lenis'
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useRef,
} from 'react'

interface Value {
  lenis: Lenis
  stopLenis: () => void
  startLenis: () => void
}

const ScrollContext = createContext<Prettify<Value> | null>(null)

interface ScrollProviderProps
  extends Partial<{
    wrapper: HTMLElement | Window
    content: HTMLElement
    wheelEventsTarget: HTMLElement | Window
    eventsTarget: HTMLElement | Window
    smoothWheel: boolean
    syncTouch: boolean
    syncTouchLerp: number
    touchInertiaMultiplier: number
    duration: number
    easing: (t: number) => number
    lerp: number
    infinite: boolean
    gestureOrientation: 'both' | 'vertical' | 'horizontal'
    orientation: 'vertical' | 'horizontal'
    touchMultiplier: number
    wheelMultiplier: number
    normalizeWheel: boolean
    autoResize: boolean
  }> {
  children: ReactNode
}

const ScrollProvider: FunctionComponent<ScrollProviderProps> = ({
  children,
  ...rest
}) => {
  const { current: lenis } = useRef(
    new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      ...rest,
    })
  )

  useEffect(() => {
    const raf: FrameRequestCallback = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.raf(() => {})
  }, [])

  function stopLenis() {
    lenis.stop()
  }

  function startLenis() {
    lenis.start()
  }

  return (
    <ScrollContext.Provider value={{ lenis, stopLenis, startLenis }}>
      {children}
    </ScrollContext.Provider>
  )
}

export { ScrollContext, ScrollProvider }
