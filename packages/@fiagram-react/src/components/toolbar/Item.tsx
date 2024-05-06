import React from 'react'
import { Icon } from '../icon'

export interface ToolBarItemProps {
  icon: IconFontType
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ToolbarItem: React.FC<ToolBarItemProps> = ({ icon, onClick }) => {
  return (
    <Icon
      type={icon}
      onClick={onClick}
      className="fiagram-tools-item"
    />
  )
}
