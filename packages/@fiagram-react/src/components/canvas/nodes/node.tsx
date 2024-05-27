import React, { useRef } from 'react'
import type { FC, MouseEventHandler } from 'react'
import cls from 'classnames'
import _ from 'lodash'
import { findNodeFromTree, getNodeTransform } from '@fiagram/core/src/utils/diagram'
import type { Shapes } from '@fiagram/core/types/diagram'
import type { Node, Nodes } from '@fiagram/core/types/nodes'
import { useDiagramStore } from '../../../hooks/useDiagramStore'
import { useNodeDragEffect } from '../../../hooks/useNodeDragEffect.ts'
import { ConnectAnchors } from './anchors/connect'
import { ResizeAnchors } from './anchors/resize.tsx'

interface IProps {
  data?: Node
  shapes?: Shapes
  children?: JSX.Element
}

export const NodeItem: FC<IProps> = (props) => {
  const dragTargetRef = useRef(null)
  const nodeInfo = props?.data
  const { connectDisabled, resizeDisabled, rotateDisabled, dragDisabled } = nodeInfo || {}
  const { state, setSelectedNodes } = useDiagramStore(state => state)
  const { selectedNodes, nodes, nodeProps } = state
  const isSelected = _.some(selectedNodes, node => node.id === nodeInfo?.id)

  let isDblClick = false

  function addNodeToSelectedNodes() {
    const newSelectedNodes: Nodes = [...selectedNodes]

    const idx = _.findIndex(newSelectedNodes, sn => sn.id === nodeInfo?.id)
    if (idx > -1) {
      newSelectedNodes.splice(idx, 1)
    } else if (nodeInfo) {
      newSelectedNodes.push(nodeInfo)
    }
    setSelectedNodes(newSelectedNodes)
  }

  // 延时区分单机/双击事件
  const delayDetectClick = _.debounce((e) => {
    if (e.ctrlKey) {
      addNodeToSelectedNodes()
    } else if (!isDblClick) {
      // const { nodes } = store.getState()
      const currentNode = findNodeFromTree(nodes, nodeInfo?.id || '')
      const onClick = currentNode?.onClick
      if (typeof onClick === 'function') {
        return onClick(nodeInfo, state)
      }
      if (nodeInfo) {
        setSelectedNodes([nodeInfo])
      }
    }
    isDblClick = false
  }, 200)

  const handleClick: MouseEventHandler = (event) => {
    event.persist()
    delayDetectClick(event)
  }

  useNodeDragEffect({ props, nodeProps, ref: dragTargetRef, dragDisabled })

  return (
    <g
      className={cls('node', nodeInfo?.className, {
        'node-selected': isSelected,
        // 'node-marquee': isMarquee,
      })}
      transform={getNodeTransform(nodeInfo)}
    >
      <g
        className={cls('node-shape', {
          'node-shape-connect-disabled': connectDisabled,
          'node-shape-resize-disabled': resizeDisabled,
          'node-shape-rotate-disabled': rotateDisabled,
        })}
        onClick={handleClick}
        // onDoubleClick={handleDblClick}
        // onContextMenu={handleContextMenu}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <rect
          x="0"
          y="0"
          className="node-shape-bg"
          width={nodeInfo?.width}
          height={nodeInfo?.height}
        />
        <g ref={dragTargetRef}>{props.children}</g>
        <ResizeAnchors node={props.data} disabled={resizeDisabled} />
        <ConnectAnchors node={nodeInfo as Node} disabled={connectDisabled || false} />
        {/* <NodeTitle */}
        {/*   defaultTextColor={defaultTextColor} */}
        {/*   node={node} */}
        {/*   nameProps={nameProps} */}
        {/*   onExpand={onExpand} */}
        {/* /> */}
      </g>
    </g>
  )
}
