import React from 'react'
import type { FC } from 'react'
import type { ToolsItemProps } from './tools-item.tsx'
import { ToolsItem } from './tools-item.tsx'

interface IProps {
  group: ToolsItemProps[]
}

export const ToolsGroup: FC<IProps> = ({ group }) => {
  return (
    <div className="fiagram-tools-group">
      {group.map((item, index) => (
        <ToolsItem key={index} {...item} />
      ))}
    </div>
  )
}
