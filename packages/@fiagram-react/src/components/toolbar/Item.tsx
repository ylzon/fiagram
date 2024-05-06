import React from 'react'
import { Icon } from '../icon'
import type { PopoverProps } from '../popover'
import { Popover } from '../popover'

const alignMap = {
  rightTop: { offset: [14, 0], targetOffset: [0, 7] },
  bottom: { offset: [0, 14], targetOffset: [-7, 0] },
}

export interface ToolBarItemProps {
  key?: string | number
  icon: IconFontType
  title?: string
  trigger?: PopoverProps['trigger']
  placement?: keyof typeof alignMap
  overlay?: React.ReactNode | string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ToolbarItem: React.FC<ToolBarItemProps> = (props) => {
  const {
    icon,
    title,
    trigger = 'hover',
    onClick,
    overlay,
    placement = 'bottom',
  } = props

  return (
    <Popover
      trigger={trigger}
      overlay={overlay || title || ''}
      align={alignMap[placement]}
      placement={placement}
    >
      <Icon
        type={icon}
        onClick={onClick}
        className="fiagram-tools-item"
      />
    </Popover>
  )
}
