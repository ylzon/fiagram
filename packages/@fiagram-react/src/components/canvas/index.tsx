import React, { forwardRef, useRef } from 'react'
import cls from 'classnames'
import { useDrop } from 'react-dnd'
import * as d3 from 'd3'
import type { DiagramProps } from '../../types/diagram'
import { uuid } from '../../utils/uuid.ts'
import { checkInsideWhichBox, findNodeFromTree } from '../../utils/drag-help.ts'
import { Nodes } from './nodes'

interface IProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef extends HTMLDivElement {}

const Canvas = forwardRef<IRef, IProps>((props, canvasRef) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // console.log('height', height)
  const {
    nodes = [],
    shapes = [],
    hideGrid,
    className,
    restChilds,
  } = props

  const dropHandle = (item: any, monitor: any) => {
    const { left, top } = svgRef?.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const { x: sourceOffsetX, y: sourceOffsetY } = monitor.getSourceClientOffset()
    const transition = d3.zoomTransform(svgRef.current as any)

    const x = (sourceOffsetX - left - transition.x) / transition.k
    const y = (sourceOffsetY - top - transition.y) / transition.k

    const newNode = {
      id: uuid(),
      width: 140,
      height: 50,
      ...item,
      x,
      y,
    }

    // if (typeof beforeInsert === 'function') {
    //   newNode = beforeInsert(newNode, state, dispatch)
    //   if (newNode === false)
    //     return
    // }

    const newNodes = [...nodes]
    const newParent = checkInsideWhichBox(newNodes, {
      ...newNode,
      relativeX: x,
      relativeY: y,
    })

    if (newParent) {
      const { relativeX: parentNodeRelativeX, relativeY: parentNodeRelativeY } = findNodeFromTree(
        newNodes,
        newParent.id,
      ) || { relativeX: 0, relativeY: 0 }
      newParent.children = (newParent.children || []).concat({
        ...newNode,
        x: newNode.x - parentNodeRelativeX,
        y: newNode.y - parentNodeRelativeY,
      })
    } else {
      newNodes.push(newNode)
    }

    delete newNode.component
    delete newNode.type

    // dispatch({ type: 'UPDATE_NODES', payload: newNodes })
    // if (typeof afterInsert === 'function')
    //   afterInsert(newNode, state, dispatch)
  }

  const [, drop] = useDrop({
    accept: 'DragDropBox',
    drop: dropHandle,
  })

  drop(svgRef)

  return (
    <div className={cls('fiagram-canvas', { hideGrid })} ref={canvasRef}>
      <svg
        ref={svgRef}
        className={cls(className, 'fiagram-canvas-svg', {
          // highlight: isHighlight,
        })}
        style={{ ...props.style }}
      >
        <defs>
          {/* <Markers edgeProps={edgeProps} theme={theme.edge} /> */}
          <filter id="blur">
            {/* <feGaussianBlur stdDeviation={gaussianBlur} /> */}
          </filter>
          <filter id="highlight-edge-blur">
            <feGaussianBlur stdDeviation={4} />
          </filter>
        </defs>
        <g className="zoom-area">
          <Nodes data={nodes} shapes={shapes} />
          {/* <Edges data={edges} theme={theme.edge} /> */}
          {/* <Auxiliary ref={auxiliaryRef} uniqId={uniqId} /> */}
          {/* <HighLightEdge selectedEdges={selectedEdges} uniqId={uniqId} /> */}
        </g>
        {/* <MarqueeSelect /> */}
        {/* {isHighlight && <rect className="mask" width="100%" height="100%" />} */}
      </svg>
      {restChilds?.map(restChild => restChild)}
    </div>
  )
})

export { Canvas }
