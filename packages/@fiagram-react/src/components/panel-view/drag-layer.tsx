import type { FC } from 'react'
import React from 'react'
import { useDragLayer } from 'react-dnd'
import { getItemStyles } from '../../utils/drag-help.ts'

interface IProps {
  children: React.ReactNode | React.ReactNode[]
}

export const CustomDragLayer: FC<IProps> = (props: any) => {
  const {
    isDragging,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging)
    return null

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
      }}
    >
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {props.children}
      </div>
    </div>
  )
}
