import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** The first grammar package in this repo to bake `prefers-reduced-motion` into its own
 * component code, rather than leaving it to a consuming app's styling. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const query = window.matchMedia(QUERY)
    const listener = () => setReduced(query.matches)

    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return reduced
}
