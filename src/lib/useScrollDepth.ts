'use client'
import { useEffect, useRef } from 'react'
import { trackScrollDepth } from './analytics'

const THRESHOLDS = [25, 50, 75, 100]

// Tracks scroll-depth thresholds for either the window (default) or a
// specific scrollable container. Resets its fired-thresholds whenever
// sectionId changes, so re-entering a section re-arms the thresholds.
export function useScrollDepth(sectionId: string, containerRef?: React.RefObject<HTMLElement | null>) {
  const fired = useRef<Set<number>>(new Set())

  useEffect(() => {
    fired.current = new Set()
    const el = containerRef?.current ?? null
    const target: EventTarget = el ?? window

    function getScrollPercent() {
      const scrollTop = el ? el.scrollTop : window.scrollY
      const scrollHeight = el ? el.scrollHeight : document.documentElement.scrollHeight
      const clientHeight = el ? el.clientHeight : window.innerHeight
      if (scrollHeight <= clientHeight) return 100
      return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
    }

    function onScroll() {
      const percent = getScrollPercent()
      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold)
          trackScrollDepth(threshold, sectionId)
        }
      }
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [sectionId, containerRef])
}
