import type { FC } from 'react'
import React from 'react'
import Tooltip from 'rc-tooltip'
import type { TooltipProps } from 'rc-tooltip/lib/Tooltip'

export interface PopoverProps extends TooltipProps {
  title?: string
  content?: string
  className?: string
}

export const Popover: FC<PopoverProps> = (props) => {
  const { children, title, content, className, ...rest } = props
  return (
    <Tooltip
      prefixCls="fiagram-tooltip"
      motion={{ motionName: 'fiagram-tooltip-fade' }}
      {...rest}
    >
      <span className={className}>
        {children}
      </span>
    </Tooltip>
  )
}
