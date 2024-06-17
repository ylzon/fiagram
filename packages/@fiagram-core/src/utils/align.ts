import _ from 'lodash'
import { ALIGN_DIRECT } from '../constant'
import type { Node, Nodes } from '../../types/nodes'
import type { Direction } from '../../types/tools.ts'
import type { XYCoord } from '../../types/diagram'
import { calcCoordAfterRotate, findNodeFromTree } from './diagram.ts'

type Corner = { x: number, y: number, node: Node } & { [id: string]: XYCoord }
type BorderRestCornerBy = Record<Direction, (list: Corner[]) => Corner>
type AlignByParams = {
  node: Node
  direct: Direction
  corner: Corner
  corners: Corner[]
}

function getCorners(node: Node, deg: number) {
  const topLeft = { x: -node.width / 2, y: -node.height / 2 }
  const topRight = { x: node.width / 2, y: -node.height / 2 }
  const bottomLeft = { x: -node.width / 2, y: node.height / 2 }
  const bottomRight = { x: node.width / 2, y: node.height / 2 }

  return _.map([topLeft, topRight, bottomLeft, bottomRight], coord =>
    calcCoordAfterRotate({
      node,
      deg,
      coord,
    }))
}

function getCornerPos(node?: Node, direct?: Direction): { x: number, y: number, coord: XYCoord } {
  if (!node) {
    return { x: 0, y: 0, coord: { x: 0, y: 0 } }
  }
  const relativeX = node?.relativeX || 0
  const relativeY = node?.relativeY || 0
  if (!direct) {
    return { x: relativeX, y: relativeY, coord: { x: 0, y: 0 } }
  }

  const hasRotate = node.absRotateDeg !== 0 ? 'rotated' : 'notRotate'
  const coord = {
    rotated: {
      [ALIGN_DIRECT.TOP]: () => {
        const coord = _.minBy(getCorners(node, node.absRotateDeg), 'y') || { x: 0, y: 0 }
        return {
          x: relativeX + coord.x,
          y: relativeY + coord.y,
          coord,
        }
      },
      [ALIGN_DIRECT.LEFT]: () => {
        const coord = _.minBy(getCorners(node, node.absRotateDeg), 'x') || { x: 0, y: 0 }
        return {
          x: relativeX + coord.x,
          y: relativeY + coord.y,
          coord,
        }
      },
      [ALIGN_DIRECT.RIGHT]: () => {
        const coord = _.maxBy(getCorners(node, node.absRotateDeg), 'x') || { x: 0, y: 0 }
        return {
          x: relativeX + coord.x,
          y: relativeY + coord.y,
          coord,
        }
      },
      [ALIGN_DIRECT.BOTTOM]: () => {
        const coord = _.maxBy(getCorners(node, node.absRotateDeg), 'y') || { x: 0, y: 0 }
        return {
          x: relativeX + coord.x,
          y: relativeY + coord.y,
          coord,
        }
      },
      [ALIGN_DIRECT.VERTICAL]: () => ({
        x: relativeX + node.width / 2,
        y: relativeY + node.height / 2,
        coord: { x: 0, y: 0 },
      }),
      [ALIGN_DIRECT.HORIZON]: () => ({
        x: relativeX + node.width / 2,
        y: relativeY + node.height / 2,
        coord: { x: 0, y: 0 },
      }),
    },
    notRotate: {
      [ALIGN_DIRECT.TOP]: () => ({ x: relativeX, y: relativeY }),
      [ALIGN_DIRECT.LEFT]: () => ({ x: relativeX, y: relativeY + node.height }),
      [ALIGN_DIRECT.RIGHT]: () => ({ x: relativeX + node.width, y: relativeY }),
      [ALIGN_DIRECT.BOTTOM]: () => ({ x: relativeX + node.width, y: relativeY + node.height }),
      [ALIGN_DIRECT.VERTICAL]: () => ({
        x: relativeX + node.width / 2,
        y: relativeY + node.height / 2,
      }),
      [ALIGN_DIRECT.HORIZON]: () => ({
        x: relativeX + node.width / 2,
        y: relativeY + node.height / 2,
      }),
    },
  }
  return coord[hasRotate][direct]() as { x: number, y: number, coord: XYCoord }
}

const getCoordOfAlignment: BorderRestCornerBy = {
  [ALIGN_DIRECT.TOP]: list => _.minBy(list, item => item.y) as Corner,
  [ALIGN_DIRECT.LEFT]: list => _.minBy(list, item => item.x) as Corner,
  [ALIGN_DIRECT.RIGHT]: list => _.maxBy(list, item => item.x) as Corner,
  [ALIGN_DIRECT.BOTTOM]: list => _.maxBy(list, item => item.y) as Corner,
  [ALIGN_DIRECT.VERTICAL]: (list) => {
    const left = _.minBy(list, item => item.x)?.x || 0
    const right = _.maxBy(list, item => item.x)?.x || 0
    return { x: left + (right - left) / 2 } as Corner
  },
  [ALIGN_DIRECT.HORIZON]: (list) => {
    const top = _.minBy(list, item => item.y)?.y || 0
    const bottom = _.maxBy(list, item => item.y)?.y || 0
    return { y: top + (bottom - top) / 2 } as Corner
  },
}

function alignBy({ node, direct, corner, corners }: AlignByParams) {
  const coord = corners.find(c => c[node?.id || ''])?.[node?.id || '']
  switch (direct) {
    case ALIGN_DIRECT.TOP:
      node.y = corner.y
      if (coord) {
        node.y -= coord.y
      }
      break
    case ALIGN_DIRECT.LEFT:
      node.x = corner.x
      if (coord) {
        node.x -= coord.x
      }
      break
    case ALIGN_DIRECT.RIGHT:
      node.x = corner.x - node.width
      if (coord) {
        node.x -= (coord.x - node.width)
      }
      break
    case ALIGN_DIRECT.BOTTOM:
      node.y = corner.y - node.height
      if (coord) {
        node.y -= (coord.y - node.height)
      }
      break
    case ALIGN_DIRECT.VERTICAL:
      node.x = corner.x - node.width / 2
      break
    case ALIGN_DIRECT.HORIZON:
      node.y = corner.y - node.height / 2
      break
    default:
      throw new Error('wrong direct')
  }
  return node
}

function setRelative(node: Node, direct: Direction) {
  switch (direct) {
    case ALIGN_DIRECT.TOP:
    case ALIGN_DIRECT.BOTTOM:
    case ALIGN_DIRECT.HORIZON:
      node.x = node.relativeX
      break
    default:
      node.y = node.relativeY
      break
  }
  return node
}

export function moveNodesAligned(alignNodes: Nodes, direct: Direction, nodes: Nodes): Nodes {
  const newNodes = [...nodes]

  // 获取各节点的四个角的坐标
  const corners = _.map(alignNodes, ({ id }) => {
    const node: Node = findNodeFromTree(newNodes, id || '') || { id: '', x: 0, y: 0, width: 0, height: 0 }
    // 找出各节点在对齐方向上的绝对坐标
    const { x, y, coord } = getCornerPos(node, direct)
    const corner = { x, y, [node?.id || '']: coord, node: { ...node } } as Corner
    if (node?.absRotateDeg) {
      corner.node.rotateDeg = node.absRotateDeg
    }
    return corner
  })
  // 对齐坐标
  const coordOfAlignment = getCoordOfAlignment[direct](corners)

  // 朝对齐坐标移动各节点
  return _.filter(corners, ({ node }) => !_.has(coordOfAlignment, node?.id || '')).map(({ node }) => {
    node = alignBy({ node, direct, corner: coordOfAlignment, corners })
    // 因为对齐平移之后需要考虑是否脱离层级的情况，所以需要设置好绝对坐标
    return setRelative(node, direct)
  })
}
