import React from 'react'
import type { FC } from 'react'
import type { PopoverProps } from '../popover'
import type { ToolBarItemProps } from './Item.tsx'
import { ToolbarItem } from './Item.tsx'

interface IProps {
  group: ToolBarItemProps[]
  trigger?: PopoverProps['trigger']
  placement?: ToolBarItemProps['placement']
}

export const ToolbarGroup: FC<IProps> = (props) => {
  const {
    group,
    trigger,
    placement,
  } = props

  return (
    <div className="fiagram-tools-group">
      {group.map((item, index) => (
        <ToolbarItem
          key={index}
          trigger={trigger}
          placement={placement}
          {...item}
        />
      ))}
    </div>
  )
}
