import { useEffect, useState } from 'react'

export function useAnimatedPercent(target) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setValue(target))
    return () => cancelAnimationFrame(id)
  }, [target])

  return value
}
