import React from 'react'
import type { FC } from 'react'

export interface DragItemProps {
  key?: string
  name?: string
  component?: () => JSX.Element
}

export const DragItem: FC<DragItemProps> = ({ component, name }) => {
  return (
    <div className="fiagram-panel-view-drag-item">
      <span className="fiagram-panel-view-drag-item-icon">
        {component?.()}
      </span>
      <span className="fiagram-panel-view-drag-item-name" title={name}>
        {name}
      </span>
    </div>
  )
}
