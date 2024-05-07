import React, { useEffect } from 'react'
import cls from 'classnames'
import type { FC } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { DRAG_DROP_KEY } from '@fiagram/core/constant'
import type { Shape } from '../../types/diagram'
import type { Node } from '../../types/nodes'
import { CustomDragLayer } from './drag-layer.tsx'

export const DragItem: FC<Shape> = ({ component, label, nodeInfo }) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: DRAG_DROP_KEY,
    item: { label, ...nodeInfo },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    // 隐藏拖拽dom
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const ItemContent = () => (
    <div className={cls('fiagram-panel-view-drag-item')}>
      <span className="fiagram-panel-view-drag-item-icon">
        {component?.({ label, ...nodeInfo } as Node)}
      </span>
      {/* <span className="fiagram-panel-view-drag-item-name" title={label}> */}
      {/*  {label} */}
      {/* </span> */}
    </div>
  )

  return (
    <>
      <div
        ref={dragRef}
        // style={{ opacity: isDragging ? 0 : 1 }}
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
