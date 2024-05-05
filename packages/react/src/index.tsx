import type { ReactNode } from 'react'
import React, { useRef } from 'react'
import cls from 'classnames'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Canvas } from './components/canvas'
import { Tools } from './components/tools'
import { useFilterChildren } from './hooks/useFilterChildren.tsx'
import type { DiagramProps } from './types/diagram'
import './utils/i18n'
import './index.scss'

interface IProps extends DiagramProps {
  children?: ReactNode[] | ReactNode
}

const Diagram: React.FC<IProps> = (props) => {
  const {
    style,
    className,
    hideTools,
    canvasClassName,
    canvasStyle,
    onLoad,
    hideGrid,
    children,
  } = props

  const canvasRef = useRef(null)
  const { toolsChild, restChilds } = useFilterChildren(children)
  const tools = !hideTools && (toolsChild || <Tools />)

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={style} className={cls('fiagram', className, { hideTools })}>
        {tools}
        <Canvas
          ref={canvasRef}
          className={canvasClassName}
          style={canvasStyle}
          onLoad={onLoad}
          hideGrid={hideGrid}
          restChilds={restChilds}
        />
      </div>
    </DndProvider>
  )
}

Diagram.displayName = 'Diagram'

export { Diagram, Tools }
