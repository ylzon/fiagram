import React from 'react'
import type { FC } from 'react'
import { ToolsGroup } from './utils/tools-group.tsx'
import type { ToolsItemProps } from './utils/tools-item.tsx'

interface IProps {}

export const Align: FC<IProps> = () => {
  const toolsGroup: ToolsItemProps[] = [
    { icon: 'vertically-centered' },
    { icon: 'distributions-centered' },
    { icon: 'horizontal-centered' },
  ]

  return (
    <ToolsGroup group={toolsGroup} />
  )
}
