import React from 'react'
import type { FC } from 'react'
import { ToolsGroup } from './utils/tools-group.tsx'
import type { ToolsItemProps } from './utils/tools-item.tsx'

interface IProps {}

export const DirectionAlign: FC<IProps> = () => {
  const toolsGroup: ToolsItemProps[] = [
    { icon: 'top-aligned' },
    { icon: 'bottom-aligned' },
    { icon: 'left-aligned' },
    { icon: 'right-aligned' },
    { icon: 'vertical-aligned' },
    { icon: 'horizontal-aligned' },
  ]

  return (
    <ToolsGroup group={toolsGroup} />
  )
}
