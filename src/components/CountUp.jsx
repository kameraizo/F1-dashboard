import { useEffect, useRef, useState } from 'react'

function CountUp({ value, duration = 900 }) {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(target)
  const frame = useRef()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      frame.current = requestAnimationFrame(() => setDisplay(target))
      return () => cancelAnimationFrame(frame.current)
    }

    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(target * eased))
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return display
}

export default CountUp
