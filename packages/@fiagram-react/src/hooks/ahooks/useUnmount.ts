import { useEffect } from 'react'
import { useLatest } from './useLatest.ts'

export function useUnmount(fn: () => void) {
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    [],
  )
}
