import React, { forwardRef, useEffect, useRef } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '@fiagram/core/types/diagram'
import { useDiagramStore } from '../../hooks/useDiagramStore'
import { useSize } from '../../hooks/ahooks/useSize'
import { useSvgInfo } from '../../hooks/useSvgInfo'
import { useCreatDrop } from '../../hooks/useCreatDrop.tsx'
import { useUpdateState } from '../../hooks/useUpdateState.tsx'
import { Nodes } from './nodes'
import { Auxiliary } from './auxiliary'
import { Edges } from './edges'

export interface CanvasProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef extends SVGSVGElement {}

const Canvas = forwardRef<IRef, CanvasProps>((props) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const auxiliaryRef = useRef<SVGGElement>(null)
  const { state, setCanvasSize } = useDiagramStore(state => state)
  const { shapes = [], hideGrid, className } = props
  const { nodes, edges } = state
  const size = useSize(svgRef)

  useEffect(() => {
    setCanvasSize(size)
  }, [size])

  useSvgInfo(svgRef, auxiliaryRef)
  useCreatDrop(svgRef)
  useUpdateState(props)

  return (
    <svg
      ref={svgRef}
      className={cls(className, 'fiagram-canvas', { hideGrid })}
      style={{ ...props.canvasStyle }}
    >
      <g className="zoom-area">
        <Nodes data={nodes} shapes={shapes} />
        <Edges data={edges} />
        <Auxiliary ref={auxiliaryRef} />
        {/* <HighLightEdge selectedEdges={selectedEdges} uniqId={uniqId} /> */}
      </g>
      {/* <MarqueeSelect /> */}
    </svg>
  )
})

export { Canvas }
