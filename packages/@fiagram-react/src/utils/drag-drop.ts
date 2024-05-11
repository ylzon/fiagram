import type { XYCoord } from 'react-dnd'
import * as d3 from 'd3'
import type { RefObject } from 'react'
import { checkInsideWhichBox, findNodeFromTree } from '@fiagram/core/src/utils/diagram'
import type { Node, Nodes } from '../types/nodes'
import type { DiagramState } from '../types/diagram'
import { uuid } from './uuid.ts'

/**
 * 获取拖动节点的样式
 * @param initialOffset
 * @param currentOffset
 */
export function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

/**
 * 处理拖放节点
 */
interface HandleDropNodeProps {
  item: any
  monitor: any
  svgRef: RefObject<SVGSVGElement>
  svgInfo: DiagramState['svgInfo']
  nodes: Nodes
}
export function handleDropNode({ item, monitor, svgRef, svgInfo, nodes }: HandleDropNodeProps) {
  const { left, top } = svgRef?.current?.getBoundingClientRect() || { left: 0, top: 0 }
  const { x: sourceOffsetX, y: sourceOffsetY } = monitor.getSourceClientOffset()
  const transition = svgInfo ? d3.zoomTransform(svgInfo.svg.node()) : { x: 0, y: 0, k: 1 }

  const x = (sourceOffsetX - left - transition.x) / transition.k
  const y = (sourceOffsetY - top - transition.y) / transition.k

  const newNode: Node = {
    ...item,
    id: uuid(),
    width: item.width || 50,
    height: item.height || 50,
    x,
    y,
  }
  const newNodes = [...nodes]
  const newParent = checkInsideWhichBox(newNodes, {
    ...newNode,
    relativeX: x,
    relativeY: y,
  })

  if (newParent) {
    const { relativeX: parentNodeRelativeX, relativeY: parentNodeRelativeY } = findNodeFromTree(
      newNodes,
      newParent?.id || uuid(),
    ) || { relativeX: 0, relativeY: 0 }
    newParent.children = (newParent.children || []).concat({
      ...newNode,
      x: (newNode?.x || 0) - (parentNodeRelativeX || 0),
      y: (newNode?.y || 0) - (parentNodeRelativeY || 0),
    })
  } else {
    newNodes.push(newNode)
  }

  delete newNode.component
  delete newNode.type

  return {
    newNodes,
    newNode,
  }
}
