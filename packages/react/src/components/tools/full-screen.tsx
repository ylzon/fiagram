import React from 'react'
import type { FC } from 'react'
import { ToolsGroup } from './utils/tools-group.tsx'
import type { ToolsItemProps } from './utils/tools-item.tsx'

interface IProps {}

export const FullScreen: FC<IProps> = () => {
  const isFullscreen = false
  const icon = (isFullscreen ? 'exit-fullscreen-icon' : 'fullscreen-icon') as IconFontType
  const toolsGroup: ToolsItemProps[] = [
    { icon },
  ]

  return (
    <ToolsGroup group={toolsGroup} />
  )
}
