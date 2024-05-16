import React, { useRef } from 'react'
import cls from 'classnames'
import type { FC } from 'react'
import _ from 'lodash'
import type { Edge, EdgeStyle } from '@fiagram/core/types/edges'
import { useDiagramStore } from '../../../hooks/useDiagramStore.ts'
import { defMarker } from './utils'

interface IProps {
  data: Edge
}

export const EdgeItem: FC<IProps> = (props) => {
  const textRef = useRef<SVGGElement>(null)
  const { data } = props
  const { name, centerX, centerY, pathD, className, labelProps } = data
  const { state } = useDiagramStore(state => state)
  const { uniqId, selectedEdges, edgeProps } = state
  const isSelected = _.some(selectedEdges, selectedEdge => selectedEdge.id === data.id)
  const style = _.mergeWith({}, data.style, edgeProps?.style, (a, b) => a || b)
  const markerId = `arrow-${data.id}`
  const pathColor = style.strokeColor || style.stroke

  function setEventHandler(handlers: any) {
    return _.reduce(
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
  }

  function renderPath(markerId: string, data: Edge, pathColor: string = '') {
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

    const hasLabel = pathD && name
    pathStyle.stroke = strokeColor || pathStyle.stroke
    pathStyle.fill = fillColor || pathStyle.fill
    const labelName = (
      <g ref={textRef} className="title" {...eventHandlers} transform={labelProps?.transform}>
        <rect
          className="back"
          fill={pathColor || fill || 'black'}
          {..._.pick(labelStyle, ['stroke', 'strokeWidth', 'rx', 'ry']) as EdgeStyle}
        />
        <text
          textAnchor="middle"
          fill={labelTextColor || textColor}
          fontSize={labelFontSize || fontSize}
        >
          {name}
        </text>
        <title>{name}</title>
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

    switch (true) {
      case _.has(edgeProps, 'renderEdge'):
        return typeof edgeProps.renderEdge === 'function' && edgeProps.renderEdge(edgeParams)
      case _.has(edgeProps, 'renderEdgeBase'):
        return (
          typeof edgeProps.renderEdgeBase === 'function'
          && edgeProps.renderEdgeBase(EdgeContent, edgeParams)
        )
      default:
        return EdgeContent
    }
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
