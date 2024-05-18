import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import _ from 'lodash'
import { DIRECTION, EDGE_TYPE } from '@fiagram/core/src/constant'
import * as d3 from 'd3'
import { calcAbsRotateDeg, calcCoordAfterRotate, findNodeFromTree } from '@fiagram/core/src/utils/diagram'
import type { Node } from '@fiagram/core/types/nodes'
import type { Edge } from '@fiagram/core/types/edges'
import { useDiagramStore } from '../../../../hooks/useDiagramStore.ts'
import { uuid } from '../../../../utils/uuid.ts'

interface IProps {
  node: Node
  disabled: boolean
}

// export function isValidEdge(edge: Edge) {
//   const validEdgeKeys = ['id', 'type', 'source', 'target']
//   return _.every(validEdgeKeys, key => _.has(edge, key))
// }

// export async function buildEdgeWithCallback({ newEdge, state, actions, operation }: any) {
//   const { nodeProps } = state
//
//   const actionType = `${operation}Edges`
//
//   if (typeof nodeProps.beforeConnect === 'function') {
//     const changeEdge = await nodeProps.beforeConnect(newEdge, state, actions)
//     if (isValidEdge(changeEdge)) {
//       newEdge = changeEdge
//       actions[actionType](newEdge)
//     }
//
//     if (typeof nodeProps.afterConnect === 'function') {
//       nodeProps.afterConnect(newEdge, state, actions)
//     }
//   } else {
//     actions[actionType](newEdge)
//     if (typeof nodeProps.afterConnect === 'function') {
//       nodeProps.afterConnect(newEdge, state, actions)
//     }
//   }
// }

const setTargetInfoClassName = (node: Node, direct: string) => `linking-target~@~${node.id}~|~${direct}`

export const ConnectAnchors: FC<IProps> = (props) => {
  const anchorsRef = useRef<SVGGElement>(null)
  const { state, insertEdge } = useDiagramStore(state => state)
  const { node, disabled } = props
  const { svgInfo, nodes } = state
  const { width, height, x, y, rotateDeg } = node

  const connectAnchors = [
    { x: width / 2, y: 0, direct: DIRECTION.TOP },
    { x: width, y: height / 2, direct: DIRECTION.RIGHT },
    { x: width / 2, y: height, direct: DIRECTION.BOTTOM },
    { x: 0, y: height / 2, direct: DIRECTION.LEFT },
  ]

  useEffect(() => {
    const anchorEl = d3.select(anchorsRef.current)
    const anchors = anchorEl.selectAll('.connect-anchors-pointer').data(connectAnchors)
    const currentNodeDom = d3.select(anchorsRef?.current?.parentNode as any)

    let readyToDrawing = false
    let dragged = false
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0
    let currentNode: Node | undefined | null = null
    let absRotateDeg = 0
    let activeAnchorSource: any = null

    function setSvgDrawing(status: boolean) {
      svgInfo.svg?.classed('linking', status)
      currentNodeDom.classed('linking-source-node', status)
      anchorEl.classed('connect-anchors-source', status)
    }

    function calculateRedunDistance(srcX: number, srcY: number, tgtX: number, tgtY: number) {
      const [offsetSrc, offsetTgt] = [0, 4]
      const deltaX = tgtX - srcX
      const deltaY = tgtY - tgtX
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const normX = deltaX / dist
      const normY = deltaY / dist

      const Mx = srcX + offsetSrc * normX
      const My = srcY + offsetSrc * normY
      const Lx = tgtX - offsetTgt * normX
      const Ly = tgtY - offsetTgt * normY

      return `M ${Mx},${My} L ${Lx},${Ly}`
    }

    function drawingLine() {
      const [x0, y0, x1, y1] = [
        (currentNode?.relativeX || 0) + startX,
        (currentNode?.relativeY || 0) + startY,
        (currentNode?.relativeX || 0) + endX,
        (currentNode?.relativeY || 0) + endY,
      ]
      const pathD = calculateRedunDistance(x0, y0, x1, y1)
      svgInfo.newLine.attr('d', pathD)
    }

    function removeDrawLine(anchorDom: any) {
      startX = 0
      startY = 0
      endX = 0
      endY = 0
      currentNode = null
      dragged = false
      readyToDrawing = false

      svgInfo.newLine.attr('d', `M 0 0`).attr('opacity', 0)

      activeAnchorSource = activeAnchorSource || d3.select(anchorDom)
      if (!activeAnchorSource.empty()) {
        activeAnchorSource.classed('connect-anchors-pointer-source', false)
      }
    }

    function createLink(d: any) {
      const {
        edgeProps: { defaultNewEdgeStyle },
      } = state
      const classNames = svgInfo.svg.attr('class').split(' ')
      const targetClassName = _.find(classNames, className => _.includes(className, 'linking-target'))
      if (targetClassName) {
        const [, targetInfoString] = targetClassName.split('~@~')
        const [target, targetDirection] = targetInfoString.split('~|~')

        const newEdgeProps = _.mergeWith(
          {},
          defaultNewEdgeStyle,
          { label: 'new link', type: EDGE_TYPE.STRAIGHT },
          (a, b) => {
            return a || b
          },
        ) as Edge

        const newEdge: Edge = {
          ...newEdgeProps,
          id: uuid(),
          source: node.id,
          sourceDirection: d.direct,
          target,
          targetDirection,
        }
        console.log('edge', newEdge)
        insertEdge(newEdge)
        // buildEdgeWithCallback({ newEdge, state, operation: 'insert' })
      }
    }
    const transformRotateCoord = (x: number, y: number) => {
      if (absRotateDeg) {
        return calcCoordAfterRotate({
          node,
          deg: absRotateDeg,
          coord: {
            x: x - node.width / 2,
            y: y - node.height / 2,
          },
        })
      }
      return { x, y }
    }

    const setReadyToDrag = (anchorDom: any) => {
      // avoid slash svg
      if (dragged) {
        // set svg as drawing mode
        setSvgDrawing(true)

        activeAnchorSource = d3.select(anchorDom)
        if (activeAnchorSource.empty()) {
          return
        }

        activeAnchorSource.classed('connect-anchors-pointer-source', true)
        // begin drawing new line
        readyToDrawing = true
        svgInfo.newLine.attr('opacity', 1).attr('marker-end', `url(#arrow)`)

        currentNode = findNodeFromTree(nodes, node?.id || '')
        // 需要判断节点是否旋转
        absRotateDeg = calcAbsRotateDeg(nodes, node)
        const coord = transformRotateCoord(startX, startY)
        startX = coord.x
        startY = coord.y
      }
    }

    function dragging(event: any) {
      const coord = transformRotateCoord(event.x, event.y)
      endX = coord.x
      endY = coord.y
      drawingLine()
    }

    function dragend(anchorDom: any, d: any) {
      setSvgDrawing(false)
      createLink(d)
      removeDrawLine(anchorDom)
    }

    const onAnchorsDrag = d3
      .drag()
      .on('start', (d) => {
        dragged = false
        startX = d.x
        startY = d.y
        readyToDrawing = false
      })
      .on('drag', function (e) {
        dragged = true
        readyToDrawing ? dragging(e) : setReadyToDrag(this)
      })
      .on('end', function (_, d) {
        if (dragged) {
          dragend(this, d)
        }
      })

    disabled
      ? anchors.on('.drag', null)
      : anchors.call(onAnchorsDrag as any)

    anchors
      .on('mouseenter', (_, d) => {
        const isBrokenDrawing = svgInfo.svg?.classed('linking')
        // 允许自连建关系
        // svgInfo.svg.classed('linking') && !currentNodeDom.classed('linking-source-node')
        if (isBrokenDrawing) {
          svgInfo.svg.classed(setTargetInfoClassName(node, d.direct), true)
        }
      })
      .on('mouseleave', (_, d) => {
        svgInfo.svg.classed(setTargetInfoClassName(node, d.direct), false)
      })

    return () => {
      !anchors.empty() && anchors.on('.drag', null)
    }
  }, [anchorsRef.current, x, y, width, height, rotateDeg])

  return (
    <g ref={anchorsRef} className="connect-anchors">
      {_.map(connectAnchors, ({ x, y }, i) => (
        <g key={i + x + y} className="connect-anchors-pointer" transform={`translate(${x}, ${y})`}>
          <circle className="outside" r={9} />
          <circle className="surround" r={8} />
          <circle className="core" r={4} />
        </g>
      ))}
    </g>
  )
}
