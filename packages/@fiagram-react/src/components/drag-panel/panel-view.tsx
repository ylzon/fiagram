import React from 'react'
import type { FC } from 'react'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'
import { DragList } from '../drag-list/drag-list.tsx'

interface IProps extends Pick<React.HTMLAttributes<HTMLElement>, 'children'> {
  title?: string
  dragList?: any[]
}

export const PanelView: FC<IProps> = (props) => {
  const {
    title,
    dragList = [],
  } = props
  const { state: { height } } = useDiagramStore(state => state)
  const maxHeight = height > 0 ? height - 120 : 'auto'

  return (
    <div className="fiagram-panel-view">
      <div className="fiagram-panel-view-header">
        {title}
      </div>
      <div className="fiagram-panel-view-content" style={{ maxHeight }}>
        <DragList dragList={dragList} />
      </div>
    </div>
  )
}
