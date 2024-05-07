import React, { forwardRef } from 'react'
import _ from 'lodash'

interface IProps {
  uniqId?: string
}

type IRef = SVGGElement

export const Auxiliary = forwardRef<IRef, IProps>((props, ref) => {
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
        <path strokeDasharray="4,4" fill="none" strokeWidth="2" style={{ pointerEvents: 'none' }} />
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
          'id': `${className}-${props?.uniqId}`,
          'data-svgkey': key,
        }))}
    </g>
  )
})
