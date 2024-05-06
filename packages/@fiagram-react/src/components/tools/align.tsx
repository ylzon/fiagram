import React from 'react'
import type { FC } from 'react'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const Align: FC<IProps> = () => {
  const toolsGroup: ToolBarItemProps[] = [
    { icon: 'vertically-centered' },
    { icon: 'distributions-centered' },
    { icon: 'horizontal-centered' },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
