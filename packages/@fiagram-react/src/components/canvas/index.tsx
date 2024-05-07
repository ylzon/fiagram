import React, { forwardRef, useEffect, useRef } from 'react'
import cls from 'classnames'
import * as d3 from 'd3'
import { useDrop } from 'react-dnd'
import { DRAG_DROP_KEY } from '@fiagram/core/constant'
import type { DiagramProps } from '../../types/diagram'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'
import { handleDropNode } from '../../utils/diagram.ts'
import { Nodes } from './nodes'
import { Auxiliary } from './auxiliary'

interface IProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef extends SVGSVGElement {}

const Canvas = forwardRef<IRef, IProps>((props) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const auxiliaryRef = useRef<SVGGElement>(null)
  const { state, setNodes, setSvgInfo } = useDiagramStore(state => state)
  const { nodes: nodeData = [], shapes = [], hideGrid, className } = props
  const { nodes, svgInfo, uniqId } = state
  const [, drop] = useDrop({
    accept: `${DRAG_DROP_KEY}-${uniqId}`,
    drop: (item, monitor) => {
      const { newNodes } = handleDropNode(
        { item, monitor, svgRef, svgInfo, nodes },
      )
      setNodes(newNodes)
    },
  })

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    setSvgInfo(svg as unknown as Element)
    setNodes(nodeData)
  }, [])

  drop(svgRef)

  return (
    <svg
      ref={svgRef}
      className={cls(className, 'fiagram-canvas', { hideGrid })}
      style={{ ...props.canvasStyle }}
    >
      <g className="zoom-area">
        <Nodes data={nodes} shapes={shapes} />
        {/* <Edges data={edges} theme={theme.edge} /> */}
        <Auxiliary ref={auxiliaryRef} uniqId={uniqId} />
        {/* <HighLightEdge selectedEdges={selectedEdges} uniqId={uniqId} /> */}
      </g>
      {/* <MarqueeSelect /> */}
    </svg>
  )
})

export { Canvas }
