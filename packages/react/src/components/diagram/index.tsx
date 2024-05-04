import React, { useRef } from 'react'
import cls from 'classnames'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Canvas } from '../canvas'
import { Tools } from '../tools'
import './index.scss'
import type { DiagramProps } from '../../types/diagram'

export const Diagram: React.FC<DiagramProps> = (props) => {
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
        className={cls('fiagram-wrapper', className, { hideTools })}
      >
        1231
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
