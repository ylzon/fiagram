import { useEffect } from 'react'
import * as d3 from 'd3'
import {
  calcAbsRotateDeg,
  checkEffectEdges,
  checkInsideWhichBox,
  checkNodesByMovingNode,
  findAndUpdateNode,
  findChainOfNode,
  findCurrentSelectedNodes,
  findNodeFromTree,
} from '@fiagram/core/src/utils/diagram'
import { floatOrIntegerReg, unexpandHeight, unexpandWidth } from '@fiagram/core/src/constant'
import type { Node, Nodes } from '@fiagram/core/types/nodes'
import type { EdgeDirection, Edges } from '@fiagram/core/types/edges'
import _ from 'lodash'
import { uuid } from '../utils/uuid'
import { useDiagramStore } from './useDiagramStore'

export function useNodeDragEffect({ props, ref, dragDisabled }: any) {
  const { state, setNodes, updateNodesAndEdges } = useDiagramStore(state => state)
  const { svgInfo, nodes = [], edges = [], copyNodeDisabled, selectedNodes: sNodes } = state

  let alignPaths: any = null
  let enterAlignPaths: any = []
  const minGap = 12
  const absRotateDeg = calcAbsRotateDeg(nodes || [], props.data)

  function checkSideAlign(nodes: Nodes, currentNode: Node, direction: EdgeDirection, point: number) {
    const isVertical = _.includes(['top', 'bottom'], direction)
    const xy = isVertical ? 'relativeY' : 'relativeX'
    const wh = isVertical ? 'height' : 'width'
    const closeNode = _.minBy(nodes, (node) => {
      const top = Math.abs((node?.[xy] || 0) - point)
      const bottom = Math.abs((node?.[xy] || 0) + node[wh] - point)
      if (currentNode.id === node.id) {
        return 99999
      }
      return _.minBy([top, bottom])
    })
    const start = Math.abs((closeNode?.[xy] || 0) - point)
    const end = Math.abs((closeNode?.[xy] || 0) + (closeNode?.[wh] || 0) - point)
    if (start < end && start < minGap) {
      return {
        sourceDirect: direction,
        targetDirect: isVertical ? 'top' : 'left',
        node: closeNode,
        gap: start,
      }
    } else {
      if (end < minGap) {
        return {
          sourceDirect: direction,
          targetDirect: isVertical ? 'bottom' : 'right',
          node: closeNode,
          gap: end,
        }
      } else {
        return null
      }
    }
  }

  const changeTransformByIndex = (str: string, index: number, replace: number) => {
    let i = 0
    return str.replace(floatOrIntegerReg, (match) => {
      i += 1
      if (i === index) return `${replace}`
      return match
    })
  }

  const checkAlign = _.debounce((node, x, y, sameLevelNodes) => {
    const stillDraging = svgInfo?.svg.classed('draging-node')
    if (!stillDraging) {
      return
    }

    const alignItems = _.sortBy(
      _.compact([
        checkSideAlign(sameLevelNodes, node, 'top', y),
        checkSideAlign(sameLevelNodes, node, 'bottom', y + node.height),
        checkSideAlign(sameLevelNodes, node, 'left', x),
        checkSideAlign(sameLevelNodes, node, 'right', x + node.width),
      ]),
      item => item.gap,
    ).slice(0, 2)

    let currentTransform = svgInfo?.dragingNode.attr('transform')
    const translateCoord = { x: 1, y: 2 }
    const alignPathsData = _.map(alignItems, (item) => {
      let d = null
      const width = item?.node?.width || 0
      const height = item?.node?.height || 0
      const relativeX = item?.node?.relativeX || 0
      const relativeY = item?.node?.relativeY || 0
      switch (item.sourceDirect) {
        case 'top':
          if (item.targetDirect === 'top') {
            d = `M ${relativeX + width / 2} ${relativeY} L ${x} ${
              relativeY
            }`
            // svgInfo.dragingNode.attr('y', relativeY)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.y,
              relativeY,
            )
          } else {
            d = `M ${relativeX + width / 2} ${relativeY
            + height} L ${x} ${relativeY + height}`
            // svgInfo.dragingNode.attr('y', relativeY + height)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.y,
              relativeY + height,
            )
          }
          break
        case 'left':
          if (item.targetDirect === 'left') {
            d = `M ${relativeX} ${relativeY + height / 2} L ${
              relativeX
            } ${y}`
            // svgInfo.dragingNode.attr('x', relativeX)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.x,
              relativeX,
            )
          } else {
            d = `M ${relativeX + width} ${relativeY
            + height / 2} L ${relativeX + width} ${y}`
            // svgInfo.dragingNode.attr('x', relativeX + width)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.x,
              relativeX + width,
            )
          }
          break
        case 'right':
          if (item.targetDirect === 'left') {
            d = `M ${relativeX} ${relativeY + height / 2} L ${
              relativeX
            } ${y}`
            // svgInfo.dragingNode.attr('x', relativeX - node.width)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.x,
              relativeX - node.width,
            )
          } else {
            d = `M ${relativeX + width} ${relativeY
            + height / 2} L ${relativeX + width} ${y}`
            // svgInfo.dragingNode.attr('x', relativeX + width - node.width)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.x,
              relativeX + width - node.width,
            )
          }
          break
        default:
          if (item.targetDirect === 'top') {
            d = `M ${relativeX + width / 2} ${relativeY} L ${x} ${
              relativeY
            }`
            // svgInfo.dragingNode.attr('y', relativeY - node.height)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.y,
              relativeY - node.height,
            )
          } else {
            d = `M ${relativeX + width / 2} ${relativeY
            + height} L ${x} ${relativeY + height}`
            // svgInfo.dragingNode.attr('y', relativeY + height - node.height)
            currentTransform = changeTransformByIndex(
              currentTransform,
              translateCoord.y,
              relativeY + height - node.height,
            )
          }
          break
      }
      return d
    })

    alignPaths = svgInfo?.svgZoomArea
      .selectAll('path.drag-align')
      .data(alignPathsData)
      .attr('d', (d: string) => {
        return d
      })

    enterAlignPaths = alignPaths
      .enter()
      .append('path')
      .classed('drag-align', true)
      .attr('d', (d: string) => {
        return d
      })
      .attr('stroke', '#00ff00')
      .attr('fill', 'node')
      .attr('stroke-width', '1px')
      // .attr('stroke-dasharray', '2px 2px')

    const [translateX, translateY] = currentTransform.match(floatOrIntegerReg)
    svgInfo?.dragingNode.attr('transform', currentTransform)
    svgInfo?.dragingNode.datum({
      translateX: Math.round(translateX),
      translateY: Math.round(translateY),
    })

    alignPaths.exit().remove()
  }, 100)

  function checkMultipleMove(selectedNodes: Nodes, nodes: Nodes, type: string) {
    const isMultipleMove
      = selectedNodes.length > 1
      && _.some(selectedNodes, selectedNode => selectedNode.id === props.data.id)

    if (type !== 'ctrl' && isMultipleMove) {
      const className = 'multi-draging-node'
      return svgInfo?.auxiliary
        .selectAll(`.${className}`)
        .data(
          _.map(selectedNodes, (node) => {
            // const node = _.cloneDeep(selectedNode)
            node.absRotateDeg = calcAbsRotateDeg(nodes, node)
            return node
          }),
        )
        .enter()
        .append('rect')
        .classed([className], true)
    }
    return null
  }

  function onMulDrag(mulNodes: any, offsetInfo: any, d3Event: any) {
    // 多选节点拖动
    mulNodes
      .datum((d: Node) => {
        let x = d3Event.x - offsetInfo[d?.id || ''].relativeOffsetX
        let y = d3Event.y - offsetInfo[d?.id || ''].relativeOffsetY
        if (d.expand === false) {
          x = x + (d.width - unexpandWidth) / 2
          y = y + (d.height - unexpandHeight) / 2
        }
        d.translateX = x
        d.translateY = y
        return d
      })
      .attr('width', (d: Node) => {
        return d.expand === false ? unexpandWidth : d.width
      })
      .attr('height', (d: Node) => {
        return d.expand === false ? unexpandHeight : d.height
      })
      .attr('transform', (d: Node) => {
        const rotateString
          = d.expand === false
            ? `rotate(${d.absRotateDeg} ${unexpandWidth / 2} ${unexpandHeight / 2})`
            : `rotate(${d.absRotateDeg}, ${d.width / 2}, ${d.height / 2})`

        const translate = `translate(${d.translateX} ${d.translateY})`

        return d.absRotateDeg ? `${translate} ${rotateString}` : translate
      })
  }

  function onDrag(currentNode: Node | null, x: Node['x'] = 0, y: Node['y'] = 0, sameLevelNodes: Nodes | undefined) {
    alignPaths && alignPaths.remove()
    enterAlignPaths && enterAlignPaths?.remove?.()

    if (props.data.expand === false) {
      svgInfo?.dragingNode
        .datum({
          translateX: x + (props.data.width - unexpandWidth) / 2,
          translateY: y + (props.data.height - unexpandHeight) / 2,
        })
        .attr('width', unexpandWidth)
        .attr('height', unexpandHeight)
        .attr('transform', (d: Node) => {
          const translate = `translate(${d.translateX} ${d.translateY})`
          return absRotateDeg
            ? `${translate} rotate(${absRotateDeg} ${unexpandWidth / 2} ${unexpandHeight / 2})`
            : translate
        })
    } else {
      svgInfo?.dragingNode
        .datum({ translateX: x, translateY: y })
        .attr('width', props.data.width)
        .attr('height', props.data.height)
        .attr('transform', (d: Node) => {
          const translate = `translate(${d.translateX} ${d.translateY})`
          return absRotateDeg
            ? `${translate} rotate(${absRotateDeg} ${props.data.width / 2} ${props.data.height
            / 2})`
            : translate
        })
      !absRotateDeg && !_.isEmpty(sameLevelNodes) && checkAlign(currentNode, x, y, sameLevelNodes)
    }
  }

  function copyChildren(children: Nodes): Nodes {
    if (_.isEmpty(children)) {
      return children
    }
    return _.map(children, child => ({
      ...child,
      id: uuid(),
      children: copyChildren(child.children || []),
    }))
  }

  function copyNode(node: Node) {
    return {
      ...node,
      id: uuid(),
      x: node.relativeX,
      y: node.relativeY,
      children: copyChildren(node?.children || []),
    }
  }

  function calNodeNewPosition({ chain, eventX, eventY, nodes, edges, isMultipleMove, type }: {
    chain: Nodes
    eventX: number
    eventY: number
    nodes: Nodes
    edges: Edges
    isMultipleMove?: boolean
    type: string
  }): [Nodes, Edges] {
    let newNodes = [...nodes]

    const parentChain: Nodes = chain.slice(0, -1)
    const currentNode: Node = { ..._.last(chain) } as Node
    currentNode.x = eventX
    currentNode.y = eventY

    const { x: relativeX, y: relativeY } = _.reduce(
      parentChain,
      (a, b) => {
        return { x: a.x + (b?.x || 0), y: a.y + (b?.y || 0) }
      },
      { x: 0, y: 0 },
    )

    currentNode.relativeX = eventX + relativeX
    currentNode.relativeY = eventY + relativeY

    if (!isMultipleMove && type === 'shift' && !copyNodeDisabled) {
      /* ctrl拖动节点，则拷贝节点 */
      const newNode = copyNode(currentNode)

      const newParent = checkInsideWhichBox(nodes, newNode)
      if (newParent) {
        newNodes = findAndUpdateNode(nodes, newParent.id, (node) => {
          const {
            relativeX: parentNodeRelativeX,
            relativeY: parentNodeRelativeY,
          } = findNodeFromTree(nodes, node?.id || '') || { relativeX: 0, relativeY: 0 }
          node.children = (node.children || []).concat({
            ...newNode,
            x: (currentNode?.relativeX || 0) - (parentNodeRelativeX || 0),
            y: (currentNode?.relativeY || 0) - (parentNodeRelativeY || 0),
          })
          return node
        })
        setNodes(newNodes)
      } else {
        setNodes(nodes.concat(newNode))
      }
      return [newNodes, edges]
    }

    newNodes = checkNodesByMovingNode({ nodes: newNodes, node: { ...currentNode }, chain })
    const newEdges = checkEffectEdges(currentNode, newNodes, edges)

    return [newNodes, newEdges]
  }

  function onDragEnd({ type, eventX, eventY, chain }: { type: string, eventX: number, eventY: number, chain: Nodes }) {
    alignPaths && alignPaths.remove()
    enterAlignPaths && enterAlignPaths?.remove?.()
    // const chain = findChainOfNode(nodes, props.data.id)
    const isChildNode = chain.length > 1

    function getRefX() {
      const coord = svgInfo?.dragingNode.datum()
      if (coord) {
        const { translateX: x } = coord
        return props.data.expand === false ? x - (props.data.width - unexpandWidth) / 2 : x
      }
    }

    function getRefY() {
      const coord = svgInfo?.dragingNode.datum()
      if (coord) {
        const { translateY: y } = coord
        return props.data.expand === false ? y - (props.data.height - unexpandHeight) / 2 : y
      }
    }

    svgInfo?.dragingNode
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0)

    const x = isChildNode ? eventX : getRefX()
    const y = isChildNode ? eventY : getRefY()
    if (!x || !y) {
      return
    }

    const result = calNodeNewPosition({
      chain,
      nodes,
      edges,
      eventX: x,
      eventY: y,
      type,
    })

    if (result) {
      const [newNodes, newEdges] = result
      updateNodesAndEdges(newNodes as Nodes, newEdges, 'patch')
    }
  }

  function onMulDragEnd(mulNodes: any, offsetInfo: any, d3Event: any) {
    const selectedNodes = mulNodes.data()
    let newNodes = [...nodes]
    let newEdges = [...edges]

    function getRefX(node: Node) {
      const x = node.translateX || 0
      return node.expand === false ? x - (node.width - unexpandWidth) / 2 : x
    }

    function getRefY(node: Node) {
      const y = node.translateY || 0
      return node.expand === false ? y - (node.height - unexpandHeight) / 2 : y
    }

    _.map(selectedNodes, (node) => {
      const chain = findChainOfNode(newNodes, node.id)

      const isChildNode = chain.length > 1

      const x = isChildNode ? d3Event.x - offsetInfo[node.id].offsetX : getRefX(node)
      const y = isChildNode ? d3Event.y - offsetInfo[node.id].offsetY : getRefY(node)
      delete node.translateX
      delete node.translateY

      const result = calNodeNewPosition({
        chain,
        eventX: x,
        eventY: y,
        nodes: newNodes,
        edges: newEdges,
        isMultipleMove: selectedNodes && selectedNodes.length > 1,
        type: d3Event.type,
      })
      if (result) {
        [newNodes, newEdges] = result
      }
    })

    mulNodes.remove()
    updateNodesAndEdges(newNodes as Nodes, newEdges, 'patch')
  }

  useEffect(() => {
    let relativeOffsetX = 0
    let relativeOffsetY = 0
    let offsetX = 0
    let offsetY = 0
    let draged = false

    // 节点多选拖动
    let mulMoveNodes: boolean = false
    const mulMoveNodesOffsetInfo: any = {}
    let dom = null

    if (ref.current) {
      dom = d3.select(ref.current)
      let readyToDrag = false
      let selectedNodes: Nodes = []
      let currentNode: Node | null = null
      let chain: Nodes = []
      let sameLevelNodes: Nodes | undefined = [] // 只和同层节点参考对齐

      dragDisabled
        ? dom.on('.drag', null)
        : dom.call(
          d3
            .drag()
            .on('start', (e) => {
              draged = false
              svgInfo?.svg.classed('draging-node', true)
              selectedNodes = findCurrentSelectedNodes(sNodes || [], nodes || [])
              mulMoveNodes = checkMultipleMove(selectedNodes, nodes || [], e.type)
              if (mulMoveNodes) {
                _.map(selectedNodes, (sn: Node) => {
                  const currentNode = findNodeFromTree(nodes || [], sn?.id || '')
                  const relativeOffsetX = e.x - (currentNode?.relativeX || 0)
                  const relativeOffsetY = e.y - (currentNode?.relativeY || 0)
                  const offsetX = e.x - (currentNode?.x || 0)
                  const offsetY = e.y - (currentNode?.y || 0)
                  mulMoveNodesOffsetInfo[sn?.id || ''] = {
                    relativeOffsetX,
                    relativeOffsetY,
                    offsetX,
                    offsetY,
                  }
                })
              } else {
                currentNode = findNodeFromTree(nodes || [], props.data.id) || null
                relativeOffsetX = e.x - (currentNode?.relativeX || 0)
                relativeOffsetY = e.y - (currentNode?.relativeY || 0)
                offsetX = e.x - (currentNode?.x || 0)
                offsetY = e.y - (currentNode?.y || 0)
              }
            })
            .on('drag', (e) => {
              if (readyToDrag) {
                draged = true
                mulMoveNodes
                  ? onMulDrag(mulMoveNodes, mulMoveNodesOffsetInfo, e)
                  : onDrag(
                    currentNode,
                    e.x - relativeOffsetX,
                    e.y - relativeOffsetY,
                    sameLevelNodes,
                  )
              } else {
                !copyNodeDisabled
                && svgInfo?.svg.classed('draging-node-copy', e.type === 'shift')
                // 只和同层节点进行对齐
                sameLevelNodes = chain.length > 1 ? chain[chain.length - 2].children : nodes
                sameLevelNodes = _.map(sameLevelNodes, (item) => {
                  return findNodeFromTree(nodes || [], (item?.id || ''))
                }).filter(item => (item?.id || '') !== props.data.id && !(item?.rotateDeg || 0)) as Nodes
                readyToDrag = true
              }
            })
            .on('end', (e) => {
              readyToDrag = false
              svgInfo?.svg.classed('draging-node', false)
              svgInfo?.svg.classed('draging-node-copy', false)
              if (draged) {
                mulMoveNodes
                  ? onMulDragEnd(mulMoveNodes, mulMoveNodesOffsetInfo, e)
                  : onDragEnd({
                    type: e.type,
                    eventX: e.x - offsetX,
                    eventY: e.y - offsetY,
                    chain,
                  })
              }
            })
            .container(function (): any {
              /*
                拖动事件的默认坐标系参考的是拖动对象的parentNode,
                当子节点拖动时需要判断层级关系中是否有旋转，有旋转则
                需要重置坐标系，否则d3.event.x/y返回的坐标信息会有偏差
              */

              let parent = this?.parentNode?.parentNode
              chain = findChainOfNode(nodes || [], props.data.id)
              if (absRotateDeg || props.data.rotateDeg) {
                parent = _.reduce(
                  chain,
                  (currentParent: any) => {
                    return currentParent?.parentNode?.parentNode
                  },
                  this,
                )
              }
              return parent?.parentNode
            }),
        )
    }
    return () => {
      dom && dom.on('.drag', null)
    }
  })
}
