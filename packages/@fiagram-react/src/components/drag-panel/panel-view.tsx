import React from 'react'
import type { FC } from 'react'
import cls from 'classnames'
import type { Shapes } from '@fiagram/core/types/diagram'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'
import { DragList } from '../drag-list/drag-list.tsx'

interface IProps extends Pick<React.HTMLAttributes<HTMLElement>, 'children'> {
  title?: string
  dragList?: Shapes
  mode?: 'flow' | 'resource'
}

export const PanelView: FC<IProps> = (props) => {
  const {
    mode = 'flow',
    title,
    dragList = [],
  } = props
  const { state: { height = 0 } } = useDiagramStore(state => state)
  const maxHeight = height > 0 ? height - 120 : 'auto'

  return (
    <div className={cls('fiagram-panel-view', `fiagram-${mode}`)}>
      <div className="fiagram-panel-view-header">
        {title}
      </div>
      <div className="fiagram-panel-view-content" style={{ maxHeight }}>
        <DragList dragList={dragList} />
      </div>
    </div>
  )
}
