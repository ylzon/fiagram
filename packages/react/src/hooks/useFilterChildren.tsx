import type { ReactNode } from 'react'

interface IUseFilterChildren {
  toolsChild: ReactNode | null
  dragBoxChild: ReactNode | null
  restChilds: ReactNode[]
}

type IUseFilterChildrenProps = (children?: ReactNode[] | ReactNode) => IUseFilterChildren

/**
 * 用来过滤 Diagram 组件下的children
 * 返回 toolChild, dragBoxChild, restChildren
 * @param children
 */
export const useFilterChildren: IUseFilterChildrenProps = (children): IUseFilterChildren => {
  let toolsChild: ReactNode = null
  let dragBoxChild: ReactNode = null
  const restChilds: ReactNode[] = []

  const handleChild = (child: ReactNode) => {
    if (child && typeof child === 'object') {
      const { type } = child as any
      if (type && type.displayName) {
        if (type.displayName === 'DragBox')
          dragBoxChild = child
        else if (type.displayName === 'Tools')
          toolsChild = child
        else
          restChilds.push(child)
      }
      else { restChilds.push(child) }
    }
    else { restChilds.push(child) }
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      handleChild(child)
    })
  }
  else {
    handleChild(children)
  }

  return {
    toolsChild,
    dragBoxChild,
    restChilds,
  }
}
