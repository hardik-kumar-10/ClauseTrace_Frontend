import { useState, useEffect } from 'react'

/** Returns a live HH:MM:SS string for the elapsed time since `startIso`. */
export function useElapsedTime(startIso) {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    if (!startIso) return
    const start = new Date(startIso).getTime()

    function tick() {
      const diff = Math.max(0, Date.now() - start)
      const h  = Math.floor(diff / 3_600_000)
      const m  = Math.floor((diff % 3_600_000) / 60_000)
      const s  = Math.floor((diff % 60_000) / 1_000)
      setElapsed(
        [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
      )
    }

    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [startIso])

  return elapsed
}
