import React from 'react'
import type { FC } from 'react'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const FullScreen: FC<IProps> = () => {
  const isFullscreen = false
  const icon = (isFullscreen ? 'exit-fullscreen-icon' : 'fullscreen-icon') as IconFontType
  const toolsGroup: ToolBarItemProps[] = [
    { icon },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
