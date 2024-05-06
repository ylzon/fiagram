import ResizeObserver from 'resize-observer-polyfill'
import { useLayoutEffect } from 'react'
import type { BasicTarget } from './utils/domTarget.ts'
import { getTargetElement } from './utils/domTarget.ts'
import createEffectWithTarget from './utils/createEffectWithTarget.ts'
import { useRafState } from './useRafState.ts'

export interface Size { width: number, height: number }

export function useSize(target: BasicTarget): Size | undefined {
  const [state, setState] = useRafState<Size | undefined>(
    () => {
      const el = getTargetElement(target)
      return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
    },
  )

  const useEffectWithTarget = createEffectWithTarget(useLayoutEffect)

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target)

      if (!el)
        return

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target
          setState({ width: clientWidth, height: clientHeight })
        })
      })
      resizeObserver.observe(el)
      return () => {
        resizeObserver.disconnect()
      }
    },
    [],
    target,
  )

  return state
}
