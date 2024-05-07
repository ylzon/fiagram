import React from 'react'
import cls from 'classnames'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { FC, ReactNode } from 'react'
import type { DiagramProps } from './types/diagram'
import { Canvas } from './components/canvas'
import { Tools } from './components/tools'
import { DragPanel } from './components/drag-panel'
import { useFilterChildren } from './hooks/useFilterChildren.tsx'
import '@fiagram/core/styles/fiagram.scss'
import './utils/i18n'

interface IProps extends DiagramProps {
  children?: ReactNode[] | ReactNode
}
const Diagram: FC<IProps> = (props) => {
  const {
    style,
    className,
    hideTools,
    canvasClassName,
    canvasStyle,
    onLoad,
    hideGrid,
    hideDragBox,
    children,
  } = props
  const { toolsChild, dragBoxChild, restChilds } = useFilterChildren(children)

  const ConditionTools = () => !hideTools && (toolsChild || <Tools />)
  const ConditionDragPanel = () => !hideDragBox && (dragBoxChild || <DragPanel />)

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={style} className={cls('fiagram', className, { hideTools })}>
        <ConditionTools />
        <ConditionDragPanel />
        <Canvas
          onLoad={onLoad}
          hideGrid={hideGrid}
          restChilds={restChilds}
          canvasStyle={canvasStyle}
          className={canvasClassName}
        />
      </div>
    </DndProvider>
  )
}

Diagram.displayName = 'Diagram'

export { Diagram, Tools, DragPanel }
