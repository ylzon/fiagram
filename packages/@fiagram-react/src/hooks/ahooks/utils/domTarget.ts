import type { MutableRefObject } from 'react'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>

export function isFunction(value: unknown): value is (...args: any) => any {
  return typeof value === 'function'
}

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!target)
    return defaultElement

  let targetElement: TargetValue<T>

  if (isFunction(target))
    targetElement = target()
  else if ('current' in target)
    targetElement = target.current
  else
    targetElement = target

  return targetElement
}
