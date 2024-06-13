import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '@fiagram/core/types/diagram'
import type { DiagramActions } from '../../hooks/useDiagramStore'
import { useDiagramStore } from '../../hooks/useDiagramStore'
import { useSize } from '../../hooks/ahooks/useSize'
import { useSvgInfo } from '../../hooks/useSvgInfo'
import { useCreatDrop } from '../../hooks/useCreatDrop.tsx'
import { useUpdateState } from '../../hooks/useUpdateState.tsx'
import { Nodes } from './nodes'
import { Auxiliary } from './auxiliary'
import { Edges } from './edges'
import { MarqueeSelect } from './marquee'

export interface CanvasProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

export interface CanvasRef extends DiagramActions {}

const Canvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const auxiliaryRef = useRef<SVGGElement>(null)
  const store = useDiagramStore(state => state)
  const { shapes = [], hideGrid, className } = props
  const { nodes, edges } = store.state
  const size = useSize(svgRef)

  useEffect(() => {
    store.setCanvasSize(size)
  }, [size])

  useSvgInfo(svgRef, auxiliaryRef, props)
  useCreatDrop(svgRef)
  useUpdateState(props)
  useImperativeHandle(ref, () => (store))

  return (
    <svg
      ref={svgRef}
      className={cls(className, 'fiagram-canvas', { hideGrid })}
      style={{ ...props.canvasStyle }}
    >
      <g className="zoom-area">
        <Nodes data={nodes || []} shapes={shapes} />
        <Edges data={edges || []} />
        <Auxiliary ref={auxiliaryRef} />
        {/* <HighLightEdge selectedEdges={selectedEdges} uniqId={uniqId} /> */}
      </g>
      <MarqueeSelect />
    </svg>
  )
})

export { Canvas }
