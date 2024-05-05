import React from 'react'
import { Icon } from '../../icon'

export interface ToolsItemProps {
  icon: IconFontType
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ToolsItem: React.FC<ToolsItemProps> = ({ icon, onClick }) => {
  return (
    <Icon
      type={icon}
      onClick={onClick}
      className="fiagram-tools-item"
    />
  )
}
