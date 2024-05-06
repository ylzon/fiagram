import React from 'react'
import type { FC } from 'react'
import type { ToolBarItemProps } from './Item.tsx'
import { ToolbarItem } from './Item.tsx'

interface IProps {
  group: ToolBarItemProps[]
}

export const ToolbarGroup: FC<IProps> = ({ group }) => {
  return (
    <div className="fiagram-tools-group">
      {group.map((item, index) => (
        <ToolbarItem key={index} {...item} />
      ))}
    </div>
  )
}
