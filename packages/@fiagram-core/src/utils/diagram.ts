import _ from 'lodash'
import type { Node, Nodes } from '../../types/nodes'

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
export function findChainOfNode(nodes: Nodes, id: string) {
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
