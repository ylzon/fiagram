import React from 'react'
import type { FC } from 'react'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const Flow: FC<IProps> = () => {
  const toolsGroup: ToolBarItemProps[] = [
    { icon: 'tuoputu' },
    { icon: 'fuwuqi' },
    { icon: 'diandian' },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
