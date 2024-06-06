import React, { useEffect, useRef } from 'react'
import cls from 'classnames'
import * as d3 from 'd3'
import _ from 'lodash'
import type { FC } from 'react'
import type { Node, Rect } from '@fiagram/core/types/nodes'
import { calcCoordAfterRotate, findNodeFromTree } from '@fiagram/core/src/utils/diagram'
import { useDiagramStore } from '../../../../hooks/useDiagramStore'

export const size = 20

interface IProps {
  node?: Node
  disabled?: boolean
}

type AnchorData = {
  x: number
  y: number
  cursor: string
  resize: (event: d3.D3DragEvent<SVGGElement, unknown, unknown>, currentProps: Node) => Rect
}

type Restrict = {
  maxWidth?: number | ((currentNode: Node, rect: Rect) => number)
  maxHeight?: number | ((currentNode: Node, rect: Rect) => number)
  minWidth?: number | ((currentNode: Node, rect: Rect) => number)
  minHeight?: number | ((currentNode: Node, rect: Rect) => number)
}

export const ResizeAnchors: FC<IProps> = ({ node, disabled }) => {
  const anchorsRef = useRef<SVGGElement | null>(null)
  const { state, resizeNode } = useDiagramStore(state => state)

  const anchorsData: AnchorData[] = [
    {
      x: 0,
      y: 0,
      cursor: 'nwse-resize',
      resize(event, currentProps) {
        const { relativeX: x = 0, relativeY: y = 0, width, height } = currentProps
        return {
          x: event.x > width ? x + width : x + event.x,
          y: event.y > height ? y + height : y + event.y,
          width: Math.abs(width - event.x),
          height: Math.abs(height - event.y),
        }
      },
    },
    {
      x: node?.width || 0,
      y: 0,
      cursor: 'nesw-resize',
      resize(event, currentProps) {
        const { relativeX: x = 0, relativeY: y = 0, height } = currentProps
        return {
          x: event.x > 0 ? x : x + event.x,
          y: event.y < height ? y + event.y : y + height,
          width: Math.abs(event.x),
          height: Math.abs(height - event.y),
        }
      },
    },
    {
      x: 0,
      y: node?.height || 0,
      cursor: 'nesw-resize',
      resize(event, currentProps) {
        const { relativeX: x = 0, relativeY: y = 0, width } = currentProps
        return {
          x: event.x < width ? x + event.x : x + width,
          y: event.y > 0 ? y : y + event.y,
          width: Math.abs(width - event.x),
          height: Math.abs(event.y),
        }
      },
    },
    {
      x: node?.width || 0,
      y: node?.height || 0,
      cursor: 'nwse-resize',
      resize(event, currentProps) {
        const { relativeX: x = 0, relativeY: y = 0 } = currentProps
        return {
          x: event.x > 0 ? x : x + event.x,
          y: event.y > 0 ? y : y + event.y,
          width: Math.abs(event.x),
          height: Math.abs(event.y),
        }
      },
    },
  ]

  function onResize(rect: Rect) {
    resizeNode(node, rect)
  }

  function checkResizeBound({ currentNode, rect, restrict }: {
    currentNode: Node
    rect: Rect
    restrict: Restrict
  }) {
    const { maxWidth, maxHeight, minWidth, minHeight } = restrict

    const newRect = { ...rect }
    // 最小宽度
    const minwidth = typeof minWidth === 'function' ? minWidth(currentNode, rect) : minWidth
    if (minwidth && rect.width < minwidth) {
      newRect.width = minwidth
    }
    // 最小高度
    const minheight = typeof minHeight === 'function' ? minHeight(currentNode, rect) : minHeight
    if (minheight && rect.height < minheight) {
      newRect.height = minheight
    }

    // 最大宽度
    const maxwidth = typeof maxWidth === 'function' ? maxWidth(currentNode, rect) : maxWidth
    if (maxwidth && rect.width > maxwidth) {
      newRect.width = maxwidth
    }
    // 最大高度
    const maxheight = typeof maxHeight === 'function' ? maxHeight(currentNode, rect) : maxHeight
    if (maxheight && rect.height > maxheight) {
      newRect.height = maxheight
    }

    return newRect
  }
  function isValidRect(rect: Rect): boolean {
    return (
      rect
      && _.isNumber(rect.x)
      && _.isNumber(rect.y)
      && _.isNumber(rect.width)
      && _.isNumber(rect.height)
    )
  }

  useEffect(() => {
    const { nodes, svgInfo, nodeProps } = state
    if (disabled || !svgInfo) return
    const restrict = _.pick(nodeProps || {}, ['maxWidth', 'maxHeight', 'minWidth', 'minHeight']) as Restrict
    // const anchorEl = d3.select<SVGGElement, unknown>(anchorsRef.current) // 解决类型问题
    const anchorEl = d3.select<SVGGElement | null, unknown>(anchorsRef.current)
    const anchors = anchorEl.selectAll<SVGPathElement, AnchorData>('rect.bg').data(anchorsData)
    let dragged = false
    let svgDefaultCursor: string
    let currentNode: Node
    let rect: Rect = { x: 0, y: 0, width: 0, height: 0 }
    const { resizeWrap, svg } = svgInfo
    anchors.call(d3
      .drag()
      .on('start', () => {
        dragged = false
        rect = { x: 0, y: 0, width: 0, height: 0 }
        resizeWrap.attr('opacity', 1)
        svg.classed('resizing-node', true)
        svgDefaultCursor = svg.style('cursor')
        // svg.style('cursor', d.cursor)
        svg.style('cursor', 'crosshair')
        // 找出该节点, 并计算出其绝对坐标
        currentNode = findNodeFromTree(nodes || [], node?.id || '') || { width: 0, height: 0, x: 0, y: 0 }
      })
      .on('drag', (e, d) => {
        dragged = true
        rect = (d as AnchorData).resize(e, currentNode)
        rect = checkResizeBound({
          currentNode,
          rect,
          restrict,
        })

        resizeWrap.attr(
          'd',
          `M ${rect.x} ${rect.y} h ${rect.width} v ${rect.height} H ${rect.x} Z`,
        )
        if (node?.rotateDeg) {
          svgInfo.resizeWrap.attr(
            'transform',
            `rotate(${node.rotateDeg} ${(currentNode?.relativeX || 0)
            + node.width / 2} ${(currentNode?.relativeY || 0) + node.height / 2})`,
          )
        }
      })
      .on('end', () => {
        if (dragged) {
          resizeWrap
            .attr('d', 'M 0 0')
            .attr('opacity', 0)
            .attr('transform', '')
          svg.classed('resizing-node', false)
          svg.style('cursor', svgDefaultCursor)
          // 如果当前节点有旋转角度，则需要对当前得出的rect坐标进行偏移
          if (node?.rotateDeg) {
            // 取放大或缩小后的rect中心点，比较其旋转前和旋转后的坐标差
            const centerX = rect.x + rect.width / 2
            const centerY = rect.y + rect.height / 2

            const originCenterX = (currentNode?.relativeX || 0) + (currentNode?.width || 0) / 2
            const originCenterY = (currentNode?.relativeY || 0) + (currentNode?.height || 0) / 2

            const dcx = centerX - originCenterX
            const dcy = centerY - originCenterY

            const coord = calcCoordAfterRotate({
              node,
              deg: node.rotateDeg,
              coord: { x: dcx, y: dcy },
            })

            const rotateCenterX = (currentNode?.relativeX || 0) + coord.x
            const rotateCenterY = (currentNode?.relativeY || 0) + coord.y
            const offsetX = rotateCenterX - centerX
            const offsetY = rotateCenterY - centerY

            rect.x += offsetX
            rect.y += offsetY
          }
          // 把绝对坐标转回相对坐标
          rect.x = (currentNode?.x || 0) - ((currentNode?.relativeX || 0) - rect.x)
          rect.y = (currentNode?.y || 0) - ((currentNode?.relativeY || 0) - rect.y)

          if (nodeProps?.beforeResize && typeof nodeProps.beforeResize === 'function') {
            const reRect = nodeProps.beforeResize(currentNode, rect)
            if (reRect) {
              isValidRect(reRect) ? onResize(reRect) : onResize(rect)
            }
          } else {
            onResize(rect)
          }
        }
      }) as any)
    return () => {
      anchors.on('.drag', null)
    }
  })

  return (
    <g className={cls('resize-anchors', { 'resize-anchors-disabled': disabled })} ref={anchorsRef}>
      {_.map(anchorsData, ({ x, y, cursor }, i) => (
        <React.Fragment key={x + y + i}>
          <rect
            className={cls('ft', { 'middle-resize': cursor.length < 'nwse-resize'.length })}
            x={x - size / 4}
            y={y - size / 4}
            width={size / 2}
            height={size / 2}
            style={{ cursor }}
          />
          <rect
            className={cls('bg', { 'middle-resize': cursor.length < 'nwse-resize'.length })}
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            style={{ cursor }}
          />
        </React.Fragment>
      ))}
    </g>
  )
}
