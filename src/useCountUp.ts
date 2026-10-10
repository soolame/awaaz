import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export function useCountUp(target: number, duration = 900): number {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(reduceMotion ? target : 0)
  const frame = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduceMotion) return
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, reduceMotion])

  return value
}
