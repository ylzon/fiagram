import React, { useRef } from 'react'
import type { FC } from 'react'
import cls from 'classnames'
import type { Shapes } from '../../../types/diagram'
import type { Node } from '../../../types/nodes'

interface IProps {
  data?: Node
  shapes?: Shapes
  children?: JSX.Element
}

export const NodeItem: FC<IProps> = (props) => {
  const dragTargetRef = useRef(null)
  return (
    <div>
      <g
        className={cls('fiagram-node', {
          // 'node-selected': isSelected,
          // 'node-marquee': isMarquee,
        })}
      >
        <g
          className={cls('fiagram-node-shape', {
            // 'node-shape-connect-disabled': connectDisabled,
            // 'node-shape-resize-disabled': resizeDisabled,
            // 'node-shape-rotate-disabled': rotateDisabled,
          })}
          // onClick={handleClick}
          // onDoubleClick={handleDblClick}
          // onContextMenu={handleContextMenu}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <rect
            x="0"
            y="0"
            className="fiagram-node-shape-bg"
            width={props.data?.width}
            height={props.data?.height}
          />
          <g ref={dragTargetRef}>{props.children}</g>
          {/* <ConnectAnchors node={props.data} disabled={connectDisabled} /> */}
          {/* <NodeTitle */}
          {/*   defaultTextColor={defaultTextColor} */}
          {/*   node={props.data} */}
          {/*   nameProps={nameProps} */}
          {/*   onExpand={onExpand} */}
          {/* /> */}
        </g>
      </g>
    </div>
  )
}
