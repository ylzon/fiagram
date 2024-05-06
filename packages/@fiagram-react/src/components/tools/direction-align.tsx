import React from 'react'
import type { FC } from 'react'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const DirectionAlign: FC<IProps> = () => {
  const toolsGroup: ToolBarItemProps[] = [
    { icon: 'top-aligned' },
    { icon: 'bottom-aligned' },
    { icon: 'left-aligned' },
    { icon: 'right-aligned' },
    { icon: 'vertical-aligned' },
    { icon: 'horizontal-aligned' },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
