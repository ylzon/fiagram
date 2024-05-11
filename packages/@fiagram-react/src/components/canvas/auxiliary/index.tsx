import React, { forwardRef } from 'react'
import _ from 'lodash'
import { useDiagramStore } from '../../../hooks/useDiagramStore.ts'

type IRef = SVGGElement

interface IProps {}

export const Auxiliary = forwardRef<IRef, IProps>((__, ref) => {
  const { state } = useDiagramStore(state => state)
  const { uniqId } = state
  const data = [
    {
      key: 'resizeWrap',
      className: 'resize-rect',
      component: <path />,
    },
    {
      key: 'newLine',
      className: 'new-line',
      component: (
        <path stroke="#7bed9f" strokeDasharray="4,4" fill="none" strokeWidth="2" style={{ pointerEvents: 'none' }} />
      ),
    },
    {
      key: 'newDragLine',
      className: 'new-drag-line',
      component: <path strokeDasharray="5,5" fill="none" strokeWidth="2" />,
    },
    {
      key: 'dragingNode',
      className: 'draging-node',
      component: <rect />,
    },
  ]

  return (
    <g ref={ref} className="auxiliary">
      {_.map(data, ({ key, component, className }) =>
        React.cloneElement(component, {
          key,
          className,
          'id': `${className}-${uniqId}`,
          'data-svgKey': key,
        }))}
    </g>
  )
})
