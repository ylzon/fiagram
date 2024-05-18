import _ from 'lodash'
import type { Node, Nodes } from '../../types/nodes'
import { DIRECTION, unexpandHeight, unexpandWidth } from '../constant'
import type { EdgeDirection } from '../../types/edges'
import type { XYCoord } from '../../types/diagram'

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
