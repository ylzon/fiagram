import React from 'react'
import _ from 'lodash'
import type { FC } from 'react'
import type { Shape, Shapes } from '../../../types/diagram'
import type { Node, NodeStyle } from '../../../types/nodes'
import { NodeItem } from './node.tsx'

interface IProps {
  data: Node[]
  shapes: Shapes
}

export const Nodes: FC<IProps> = ({ data, shapes }) => {
  function formatStyle(style: Shape['style']) {
    const { fillColor: fill, strokeColor: stroke, ...restStyle } = style || {}
    const originStyle = {
      fill,
      stroke,
      ...restStyle,
    }
    return _.mergeWith({}, originStyle, (a, b) => a || b)
  }
  const renderShape = (node: Node) => {
    const shape = _.find(shapes, shape => shape.key === node.shape)
    if (shape) {
      const style: NodeStyle = formatStyle(node?.style || shape.style)
      const data: Node = { ...node, style }
      return (
        <NodeItem key={node.id} shapes={shapes} data={data}>
          {shape?.component?.(data)}
        </NodeItem>
      )
    }
  }
  return (
    <g className="nodes-container">
      {_.map(data, renderShape)}
    </g>
  )
}
