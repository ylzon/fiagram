import React, { forwardRef, useRef } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '../../types/diagram'

interface IProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef extends HTMLDivElement {}

const Canvas = forwardRef<IRef, IProps>((props, canvasRef) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const {
    hideGrid,
    className,
    restChilds,
  } = props

  // useImperativeHandle(ref, () => ({
  //   // someMethod
  // }))

  return (
    <div className={cls('fiagram-canvas', { hideGrid })} ref={canvasRef}>
      <svg
        ref={svgRef}
        className={cls(className, 'fiagram-canvas-svg', {
          // highlight: isHighlight,
        })}
        style={props.style}
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
          {/* <Nodes data={nodes} shapes={shapes} theme={theme.node} /> */}
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
