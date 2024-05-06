import React, { useEffect } from 'react'
import type { FC } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { CustomDragLayer } from './drag-layer.tsx'

export interface DragItemProps {
  key?: string
  name?: string
  component?: () => JSX.Element
  node?: Node
}

export const DragItem: FC<DragItemProps> = ({ component, name, node }) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: `DragDropBox`,
    item: node,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    // 隐藏拖拽dom
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const ItemContent = () => (
    <div className="fiagram-panel-view-drag-item">
      <span className="fiagram-panel-view-drag-item-icon">
        {component?.()}
      </span>
      <span className="fiagram-panel-view-drag-item-name" title={name}>
        {name}
      </span>
    </div>
  )

  return (
    <>
      <div
        ref={dragRef}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
        <ItemContent key="source" />
      </div>
      <CustomDragLayer>
        <div style={{ opacity: isDragging ? 1 : 0 }}>
          <ItemContent key="layer" />
        </div>
      </CustomDragLayer>
    </>
  )
}
