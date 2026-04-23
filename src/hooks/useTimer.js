import { useState, useRef, useEffect } from 'react'

/**
 * Starts a millisecond timer on mount.
 * Call stop() to freeze it and record the final time.
 *
 * @returns {{ displayMs: number, isDone: boolean, stop: () => void }}
 */
export function useTimer() {
  const [liveMs, setLiveMs] = useState(0)
  const [doneMs, setDoneMs] = useState(null)
  const startRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    startRef.current = performance.now()
    intervalRef.current = setInterval(() => {
      setLiveMs(performance.now() - startRef.current)
    }, 100)
    return () => clearInterval(intervalRef.current)
  }, [])

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setDoneMs(performance.now() - startRef.current)
    }
  }

  return {
    displayMs: doneMs !== null ? doneMs : liveMs,
    isDone: doneMs !== null,
    stop,
  }
}
