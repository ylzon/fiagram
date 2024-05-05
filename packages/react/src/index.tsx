import React, { useRef } from 'react'
import cls from 'classnames'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Canvas } from './components/canvas'
import { Tools } from './components/tools'
import type { DiagramProps } from './types/diagram'
import './utils/i18n'
import './index.scss'

const Diagram: React.FC<DiagramProps> = (props) => {
  const {
    style,
    className,
    hideTools,
    canvasClassName,
    canvasStyle,
    onLoad,
    hideGrid,
  } = props

  const canvasRef = useRef(null)

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={style}
        className={cls('fiagram', className, { hideTools })}
      >
        <Tools />
        <Canvas
          ref={canvasRef}
          className={canvasClassName}
          style={canvasStyle}
          onLoad={onLoad}
          hideGrid={hideGrid}
        />
      </div>
    </DndProvider>
  )
}

Diagram.displayName = 'Diagram'

export { Diagram }
