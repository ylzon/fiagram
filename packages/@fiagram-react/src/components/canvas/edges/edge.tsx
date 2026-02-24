import React, { useRef } from 'react'
import cls from 'classnames'
import type { FC } from 'react'
import _ from 'lodash'
import type { Edge, EdgeStyle } from '@fiagram/core/types/edges'
import { useDiagramStore } from '../../../hooks/useDiagramStore.ts'
import { useEdgeLabelPosition } from '../../../hooks/useEdgeLabelPosition.tsx'
import { defMarker } from './utils'

interface IProps {
  data: Edge
}

export const EdgeItem: FC<IProps> = (props) => {
  const textRef = useRef<SVGGElement>(null)
  const { data } = props
  const { label, centerX, centerY, pathD, className, labelProps } = data
  const { state } = useDiagramStore(state => state)
  const { uniqId, selectedEdges, edgeProps } = state
  const isSelected = _.some(selectedEdges, selectedEdge => selectedEdge.id === data.id)
  const style = _.mergeWith({}, data.style, edgeProps?.style, (a, b) => a || b)
  const markerId = `arrow-${data.id}`
  const pathColor = style.strokeColor || style.stroke

  // 设置标签位置
  useEdgeLabelPosition(textRef, data)

  const setEventHandler = (handlers: any) => _.reduce(
    _.keys(handlers),
    (events: any, key) => {
      const handler = handlers[key]
      if (typeof handler === 'function') {
        events[key] = (e: any) => {
          e.preventDefault()
          e.stopPropagation()
          if (key === 'onContextMenu') {
            const labelBoundingrect = textRef.current?.getBoundingClientRect?.()
            handler({
              edge: data,
              state,
              options: { event, labelBoundingrect },
            })
          } else {
            handler({ edge: data, state, event })
          }
        }
      }
      return events
    },
    {},
  )
  const renderPath = (markerId: string, data: Edge, pathColor: string = '') => {
    const { arrowType } = data
    // 双向箭头类型有两个箭头
    let markerStart = null
    if (arrowType && arrowType === 'DOUBLE_ARROW') {
      markerStart = `DOUBLE-${markerId}`
    }
    const markerEnd = markerId || 'arrow'
    const eventHandlers = setEventHandler(
      _.pick(labelProps, ['onClick', 'onContextMenu', 'onMouseEnter', 'onMouseLeave']),
    )

    const { textColor, fontSize, fillColor, strokeColor, ...pathStyle } = style
    const { textColor: labelTextColor, fontSize: labelFontSize, fill, ...labelStyle } = labelProps || {}

    const hasLabel = pathD && label
    pathStyle.stroke = strokeColor || pathStyle.stroke
    pathStyle.fill = fillColor || pathStyle.fill
    const labelName = (
      <g ref={textRef} className="title" {...eventHandlers} transform={labelProps?.transform}>
        <rect
          className="back"
          fill={pathColor || fill || '#8586a3'}
          rx={4}
          ry={4}
          {..._.pick(labelStyle, ['stroke', 'strokeWidth', 'rx', 'ry']) as EdgeStyle}
        />
        <text
          textAnchor="middle"
          fill={labelTextColor || textColor || 'white'}
          fontSize={labelFontSize || fontSize || 12}
        >
          {label}
        </text>
        <title>{label}</title>
      </g>
    )
    const EdgeContent = (
      <React.Fragment>
        <path className="bg" d={pathD} filter="url(#highlight-edge-blur)" />
        <path
          className="ft"
          d={pathD}
          strokeWidth={2}
          stroke={pathStyle?.stroke || '#A1A2BB'}
          fill={pathStyle?.fill || 'transparent'}
          markerEnd={`url(#${markerEnd})`}
          markerStart={markerStart ? `url(#${markerStart})` : ''}
          {..._.pick(pathStyle, ['strokeWidth', 'strokeDasharray'])}
        />
        {hasLabel ? labelName : null}
      </React.Fragment>
    )

    const edgeParams = [
      {
        ...data,
        pathD,
        centerX,
        centerY,
        style,
        markerEnd,
        markerStart,
      },
      state,
    ]

    const renderEdgeFn = edgeProps?.renderEdge
    const renderEdgeBaseFn = edgeProps?.renderEdgeBase

    if (typeof renderEdgeFn === 'function') {
      return renderEdgeFn(edgeParams)
    }
    if (typeof renderEdgeBaseFn === 'function') {
      return renderEdgeBaseFn(EdgeContent, edgeParams)
    }
    return EdgeContent
  }

  return (
    <g
      id={`${data.id}-${uniqId}`}
      className={cls('edge', className, {
        'edge-selected': isSelected,
      })}
      // onClick={handleClick}
      // onDoubleClick={handleDblClick}
      // onContextMenu={handleContextMenu}
      // filter={filter}
    >
      {markerId && defMarker(markerId, pathColor)}
      {renderPath(markerId, data, pathColor)}
    </g>
  )
}
