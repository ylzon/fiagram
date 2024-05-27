import _ from 'lodash'
import type { Node, Nodes, Rect } from '../../types/nodes'
import { DIRECTION, unexpandHeight, unexpandWidth } from '../constant'
import type { EdgeDirection, Edges } from '../../types/edges'
import type { XYCoord } from '../../types/diagram'
import { generateEdgePath } from './edge'

/**
 * 角度转弧度
 * @param deg
 */
export const degToAngle = (deg: number) => deg * (Math.PI / 180)

/**
 * 计算任意一点 相对于某一节点的中点为原点坐标时的旋转后坐标
 */
export function calcCoordAfterRotate({ node, deg, coord: { x, y } }: { node: Node, deg: number, coord: { x: number, y: number } }) {
  const centerX = node.width / 2
  const centerY = node.height / 2

  const dx = x
  const dy = y

  const rx = dx * Math.cos(degToAngle(deg)) - dy * Math.sin(degToAngle(deg))
  const ry = dy * Math.cos(degToAngle(deg)) + dx * Math.sin(degToAngle(deg))

  return {
    x: centerX + rx,
    y: centerY + ry,
  }
}

/**
 * 找出容器中某一节点的祖先链
 * @param nodes
 * @param id
 */
export function findChainOfNode(nodes: Nodes, id: Node['id']) {
  let chain: Nodes = []
  const node = _.find(nodes, node => node.id === id)
  if (node) {
    chain = [node]
  } else {
    _.forEach(nodes, (node) => {
      if (_.isEmpty(chain)) {
        const result = findChainOfNode(node.children || [], id)
        if (!_.isEmpty(result))
          chain = [node].concat(result)
      }
    })
  }
  return chain
}

/**
 * 根据Id找出容器中的节点及计算出相对坐标
 * @param originNodes
 * @param id
 */
export function findNodeFromTree(originNodes: Nodes, id: string): Node | undefined {
  const chain = findChainOfNode(originNodes, id)
  if (!_.isEmpty(chain)) {
    const node = _.last(chain)
    if (node) {
      let currentRotateDeg = 0
      const { relativeX, relativeY, absRotateDeg } = _.reduce(
        chain,
        (item, node, index) => {
          item.relativeX += (node.x || 0)
          item.relativeY += (node.y || 0)

          item.absRotateDeg += +(node.rotateDeg || 0)

          // 父层有旋转则当前绝对坐标需要平移
          if (index > 0 && (chain[index - 1].rotateDeg || currentRotateDeg)) {
            const parentNode = chain[index - 1]
            if (parentNode.rotateDeg)
              currentRotateDeg += +parentNode.rotateDeg

            const parentNodeRelativeX = item.relativeX - (node.x || 0)
            const parentNodeRelativeY = item.relativeY - (node.y || 0)
            const coord = calcCoordAfterRotate({
              node: parentNode,
              deg: currentRotateDeg,
              coord: {
                x: (node.x || 0) + node.width / 2 - parentNode.width / 2,
                y: (node.y || 0) + node.height / 2 - parentNode.height / 2,
              },
            })
            const rotateCenterX = parentNodeRelativeX + coord.x
            const rotateCenterY = parentNodeRelativeY + coord.y
            const offsetX = rotateCenterX - (item.relativeX + node.width / 2)
            const offsetY = rotateCenterY - (item.relativeY + node.height / 2)
            item.relativeX += offsetX
            item.relativeY += offsetY
          }
          return item
        },
        { relativeX: 0, relativeY: 0, absRotateDeg: 0 },
      )

      return { ...node, absRotateDeg: absRotateDeg % 360, relativeX, relativeY }
    }
    return node
  }
  return undefined
}

/**
 * 当拖动某一节点时判断是否拖入/拖出某一目标
 * @param nodes
 * @param currentNode
 * @param relativeX
 * @param relativeY
 */
export function checkInsideWhichBox(nodes: Nodes, currentNode: Node, relativeX = 0, relativeY = 0): Node | undefined {
  const parentNode = _.find(nodes, node => insideBox(node, currentNode, relativeX, relativeY))
  if (parentNode) {
    return (
      checkInsideWhichBox(
        parentNode.children || [],
        currentNode,
        (parentNode.x || 0) + relativeX,
        (parentNode.y || 0) + relativeY,
      ) || parentNode
    )
  }
  return parentNode
}

/**
 * 判断节点是否在某一盒子内
 * @param node
 * @param currentNode
 * @param relativeX
 * @param relativeY
 */
function insideBox(node: Node, currentNode: Node, relativeX: number, relativeY: number) {
  const unExpandWidth = 52
  const unExpandHeight = 52
  let currentNodeX = currentNode.relativeX
  let currentNodeY = currentNode.relativeY
  let currentNodeWidth = currentNode.width
  let currentNodeHeight = currentNode.height
  if (currentNode.expand === false) {
    currentNodeX = (currentNode?.relativeX || 0) + ((currentNode.width || 0) - unExpandWidth) / 2
    currentNodeY = (currentNode?.relativeY || 0) + ((currentNode.height || 0) - unExpandHeight) / 2
    currentNodeWidth = unExpandWidth
    currentNodeHeight = unExpandHeight
  }
  return (
    node.expand !== false
    && node.id !== currentNode.id
    && node.draginDisabled !== true
    && (currentNodeX || 0) >= (node.x || 0) + relativeX
    && (currentNodeX || 0) + currentNodeWidth <= (node.x || 0) + relativeX + node.width
    && (currentNodeY || 0) >= (node.y || 0) + relativeY
    && (currentNodeY || 0) + currentNodeHeight <= (node.y || 0) + relativeY + node.height
  )
}

/**
 * 计算节点的绝对旋转角度
 * @param nodes
 * @param node
 */
export function calcAbsRotateDeg(nodes: Nodes, node: Node) {
  const chain = findChainOfNode(nodes, node?.id || '')
  return (
    _.reduce(
      chain,
      (deg, node) => {
        deg += +(node.rotateDeg || 0)
        return deg
      },
      0,
    ) % 360
  )
}

/**
 * 获取节点的transform
 * @param node
 */
export function getNodeTransform(node?: Node) {
  const { x = 0, y = 0, rotateDeg, width, height } = node || {}
  const translate = `translate(${x}, ${y})`
  if (rotateDeg) {
    return `${translate} rotate(${rotateDeg} ${(width || 0) / 2} ${(height || 0) / 2})`
  }
  return translate
}

function cutChainFromUnExpandNode(chain: Nodes) {
  const idx = _.findIndex(chain, node => node.expand === false)
  if (idx > -1) {
    return chain.slice(0, idx + 1)
  }
  return chain
}

/**
 * 根据Id找出容器中的节点及计算出相对坐标
 * @param nodes
 * @param nodeId
 */
export function findNode(nodes: Nodes, nodeId: Node['id']): Node | null | undefined {
  const chain = findChainOfNode(nodes, nodeId)
  if (_.isEmpty(chain)) {
    return null
  }
  const cutChain = cutChainFromUnExpandNode(chain)

  let currentRotateDeg = 0
  const { relativeX, relativeY } = _.reduce(
    cutChain,
    (item, node, index) => {
      if (node.expand === false) {
        item.relativeX += (node.x || 0) + (node.width - unexpandWidth) / 2
        item.relativeY += (node.y || 0) + (node.height - unexpandHeight) / 2
      } else {
        item.relativeX += (node.x || 0)
        item.relativeY += (node.y || 0)
      }
      // 父层有旋转则当前绝对坐标需要平移
      if (index > 0 && (cutChain[index - 1].rotateDeg || currentRotateDeg)) {
        const parentNode = cutChain[index - 1]
        if (parentNode.rotateDeg) {
          currentRotateDeg += +parentNode.rotateDeg
        }
        const parentNodeRelativeX = item.relativeX - (node.x || 0)
        const parentNodeRelativeY = item.relativeY - (node.y || 0)
        const coord = calcCoordAfterRotate({
          node: parentNode,
          deg: currentRotateDeg,
          coord: {
            x: (node.x || 0) + node.width / 2 - parentNode.width / 2,
            y: (node.y || 0) + node.height / 2 - parentNode.height / 2,
          },
        })
        const rotateCenterX = parentNodeRelativeX + coord.x
        const rotateCenterY = parentNodeRelativeY + coord.y
        const offsetX = rotateCenterX - (item.relativeX + node.width / 2)
        const offsetY = rotateCenterY - (item.relativeY + node.height / 2)
        item.relativeX += offsetX
        item.relativeY += offsetY
      }
      return item
    },
    { relativeX: 0, relativeY: 0 },
  )

  const node: Node | undefined = _.last(cutChain)
  const absRotateDeg
    = _.reduce(
      cutChain,
      (deg, node) => {
        deg += +(node.rotateDeg || 0)
        return deg
      },
      0,
    ) % 360

  const width = node?.expand === false ? unexpandWidth : node?.width
  const height = node?.expand === false ? unexpandHeight : node?.height

  return {
    ..._.pick(node, ['id', 'x', 'y', 'expand']),
    absRotateDeg,
    relativeX,
    relativeY,
    width: width || 50,
    height: height || 50,
    originWidth: node?.width,
    originHeight: node?.height,
  }
}

/**
 * 计算加上偏移量后的坐标
 * @param direction
 * @param node
 * @param rotateDeg
 */
export function calcOffset(direction: EdgeDirection, node: Node, rotateDeg?: number): XYCoord {
  const [direct, offset] = direction?.split('|') || []
  let directOffset = +offset

  const isInHorizonSide = _.includes([DIRECTION.LEFT, DIRECTION.RIGHT], direct)
  if (directOffset < 1) {
    directOffset = isInHorizonSide ? directOffset * node.height : directOffset * node.width
  }

  if (node.expand === false) {
    directOffset = isInHorizonSide
      ? (directOffset * node.height) / node?.originHeight
      : (directOffset * node.width) / node?.originWidth
  }

  const { relativeX = 0, relativeY = 0, width, height } = node
  let offsetX = 0
  let offsetY = 0

  const centerX = width / 2
  const centerY = height / 2

  switch (direct) {
    case DIRECTION.TOP:
      offsetX = directOffset || centerX
      break
    case DIRECTION.RIGHT:
      offsetX = width
      offsetY = directOffset || centerY
      break
    case DIRECTION.BOTTOM:
      offsetX = directOffset || centerX
      offsetY = height
      break
    default:
      offsetY = directOffset || centerY
      break
  }

  if (rotateDeg) {
    const coord = calcCoordAfterRotate({
      node,
      deg: rotateDeg,
      coord: {
        x: offsetX - centerX,
        y: offsetY - centerY,
      },
    })
    offsetX = coord.x
    offsetY = coord.y
  }

  return { x: relativeX + offsetX, y: relativeY + offsetY }
}

/**
 * 最小化矩形
 * @param rect
 * @param currentNode
 */
export function minimizeRect(rect: Rect, currentNode: Node) {
  const list = currentNode?.children || []
  const hasChildren = !_.isEmpty(list)
  if (hasChildren) {
    const topmostNode = _.minBy(list, (node: Node) => node.y)
    const rightmostNode = _.maxBy(list, (node: Node) => (node?.x || 0) + node.width)
    const bottommostNode = _.maxBy(list, (node: Node) => (node?.y || 0) + node.height)
    const leftmostNode = _.minBy(list, (node: Node) => node.x)

    const padding = 4
    const minWidth = (rightmostNode?.x || 0) + (rightmostNode?.width || 0) - (leftmostNode?.x || 0) + padding * 2
    const minHeight = (bottommostNode?.y || 0) + (bottommostNode?.height || 0) - (topmostNode?.y || 0) + padding * 2

    if (rect.width < minWidth) {
      const diff = minWidth - rect.width
      const offsetX = (leftmostNode?.x || 0) - padding
      rect.width = minWidth
      if (currentNode.width === minWidth) {
        rect.x = currentNode.x || 0
      } else {
        if (rect.x !== currentNode.x) {
          rect.x -= diff - padding
        }
        _.map(list, (node: Node) => {
          let newX = (node?.x || 0)
          newX -= offsetX
          return newX
        })
      }
    }
    if (rect.height < minHeight) {
      const diff = minHeight - rect.height
      const offsetY = (leftmostNode?.y || 0) - padding
      rect.height = minHeight
      if (currentNode.height === minHeight) {
        rect.y = currentNode.y || 0
      } else {
        if (rect.y !== currentNode.y) {
          rect.y -= diff - padding
        }
        _.map(list, (node: Node) => {
          let newY = (node?.y || 0)
          newY -= offsetY
          return newY
        })
      }
    }
  }
  return rect
}

/**
 * 找到并更新节点
 * @param originNodes
 * @param id
 * @param options
 */
export function findAndUpdateNode(originNodes: Nodes = [], id: Node['id'], options: Node | ((node: Node) => Node)) {
  const nodes = _.cloneDeep(originNodes)
  if (nodes && nodes.length > 0) {
    return _.map(nodes, (node) => {
      if (node.id === id) {
        node = typeof options === 'function' ? options(node) : { ...node, ...options }
      } else {
        node.children = findAndUpdateNode(node.children, id, options)
      }
      return node
    })
  }
  return nodes
}

/**
 * 当节点移动时，与其相关的线需要从新计算路径
 * @param children
 */
function findAllChildren(children: Nodes) {
  if (_.isEmpty(children)) {
    return []
  }
  const result: Nodes[] = _.map(children, (node) => {
    return [node].concat(findAllChildren(node?.children || []))
  })

  return _.reduce(result, (a: Nodes, b) => a.concat(b), [])
}

/**
 * 检查节点移动后是否影响到连线
 * @param node
 * @param nodes
 * @param edges
 */
export function checkEffectEdges(node: Node, nodes: Nodes, edges: Edges) {
  const targetNodes = [node]
  const result = _.map(targetNodes, node => findAllChildren(node.children || []))
  const allChildrenNodes = _.reduce(result, (a: Nodes, b) => a.concat(b || []), [])
  const nodeIds = _.map(allChildrenNodes.concat(targetNodes), 'id')

  return _.map(edges, (edge) => {
    const isRelativeEdge = _.includes(nodeIds, edge.source) || _.includes(nodeIds, edge.target)
    if (isRelativeEdge) {
      edge = generateEdgePath(nodes, edge)
    }
    return edge
  })
}

/**
 * 检查节点是否移动
 */
export function checkNodesByMovingNode({ node, nodes, chain }: { node: Node, nodes: Nodes, chain?: Nodes }) {
  let newNodes = [...nodes]
  const currentNode = { ...node }

  if (!chain) {
    chain = findChainOfNode(nodes, node.id)
  }

  /* 判断是否拖入/拖出某一目标范围 */
  const prevParent = chain[chain.length - 2]
  const newParent = checkInsideWhichBox(newNodes, currentNode)

  if (!_.isEqual(newParent, prevParent)) {
    if (prevParent) {
      newNodes = findAndUpdateNode(newNodes, prevParent.id, (node) => {
        node.children = _.filter(node.children, item => item.id !== currentNode.id)
        return node
      })
    } else {
      newNodes = _.filter(newNodes, item => item.id !== currentNode.id)
    }

    if (newParent) {
      newNodes = findAndUpdateNode(newNodes, newParent.id, (node) => {
        const { relativeX: parentNodeRelativeX, relativeY: parentNodeRelativeY } = findNodeFromTree(
          newNodes,
          node?.id || '',
        ) || { relativeX: 0, relativeY: 0 }
        node.children = (node.children || []).concat({
          ...currentNode,
          x: (currentNode?.relativeX || 0) - (parentNodeRelativeX || 0),
          y: (currentNode?.relativeY || 0) - (parentNodeRelativeY || 0),
        })
        return node
      })
    } else {
      newNodes = newNodes.concat({
        ...currentNode,
        x: currentNode.relativeX,
        y: currentNode.relativeY,
      })
    }
  } else {
    if (prevParent) {
      newNodes = findAndUpdateNode(newNodes, prevParent.id, (node) => {
        const { x: parentNodeRelativeX, y: parentNodeRelativeY } = _.reduce(
          chain.slice(0, -1),
          (result, node) => {
            return { x: result.x + (node?.x || 0), y: (result?.y || 0) + (node?.y || 0) }
          },
          { x: 0, y: 0 },
        )
        const idx = _.findIndex(node.children, node => node.id === currentNode.id)
        if (node.children?.[idx]) {
          node.children[idx].x = (currentNode?.relativeX || 0) - parentNodeRelativeX
          node.children[idx].y = (currentNode?.relativeY || 0) - parentNodeRelativeY
        }
        return node
      })
    } else {
      newNodes = findAndUpdateNode(newNodes, currentNode.id, (node) => {
        node.x = currentNode.relativeX
        node.y = currentNode.relativeY
        return node
      })
    }
  }
  return newNodes
}

/**
 * 查找当前选中的节点
 * @param selectedNodes
 * @param nodes
 */
export function findCurrentSelectedNodes(selectedNodes: Nodes, nodes: Nodes): Nodes {
  return _.map(selectedNodes, sNode => findNode(nodes, sNode.id) as Node) || []
}
