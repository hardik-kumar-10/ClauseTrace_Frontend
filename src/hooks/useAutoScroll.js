import { useRef, useEffect, useState } from 'react'

/**
 * Attaches to a scrollable container.  Auto-scrolls to the bottom whenever
 * `deps` change, unless the user has manually scrolled up (FE-11).
 */
export function useAutoScroll(deps = []) {
  const containerRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
      setIsPaused(!atBottom)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, deps)

  const resume = () => {
    setIsPaused(false)
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  return { containerRef, isPaused, resume }
}
