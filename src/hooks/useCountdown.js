import { useCallback, useEffect, useRef, useState } from 'react'

const TICK_MS = 1000

/**
 * Whole-second countdown used by the rest timer.
 * `onTick` fires on every second (including the first), `onComplete` at zero.
 */
export function useCountdown({ onTick, onComplete } = {}) {
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const tickRef = useRef(onTick)
  const completeRef = useRef(onComplete)

  useEffect(() => {
    tickRef.current = onTick
  }, [onTick])

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clear()
    setRunning(false)
    setRemaining(0)
  }, [clear])

  const start = useCallback(
    (from = 5) => {
      clear()
      let left = from
      setRemaining(left)
      setRunning(true)
      tickRef.current?.(left)

      intervalRef.current = window.setInterval(() => {
        left -= 1
        if (left <= 0) {
          clear()
          setRunning(false)
          setRemaining(0)
          completeRef.current?.()
          return
        }
        setRemaining(left)
        tickRef.current?.(left)
      }, TICK_MS)
    },
    [clear]
  )

  useEffect(() => clear, [clear])

  return { remaining, running, start, stop }
}
