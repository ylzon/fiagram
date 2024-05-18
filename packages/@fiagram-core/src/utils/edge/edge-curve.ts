import { DIRECTION } from '../../constant'
import type { XYCoord } from '../../../types/diagram'
import { calcCoordAfterRotate, calcOffset } from '../diagram.ts'
import type { CalcEdgePathParams } from './edge-default.ts'

/**
 * 计算两点之间的距离
 * @param srcEnd
 * @param tgtEnd
 */
export function calcDistanceOfEnds(srcEnd: XYCoord, tgtEnd: XYCoord) {
  const deltaX = (tgtEnd.x || 0) - (srcEnd.x || 0)
  const deltaY = (tgtEnd.y || 0) - (srcEnd.y || 0)
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

export const generateCurvePath: CalcEdgePathParams = ({ srcNode, tgtNode }) => {
  // 计算源/目标节点的绝对旋转角度
  const srcAbsRotateDeg = srcNode.absRotateDeg
  const tgtAbsRotateDeg = tgtNode.absRotateDeg
  const { relativeX: srcX = 0, relativeY: srcY = 0 } = srcNode
  const { relativeX: tgtX = 0, relativeY: tgtY = 0 } = tgtNode
  const [leftEnd, rightEnd] = srcX < tgtX
    ? [calcOffset(DIRECTION.RIGHT, srcNode), calcOffset(DIRECTION.LEFT, tgtNode)]
    : [calcOffset(DIRECTION.LEFT, srcNode), calcOffset(DIRECTION.RIGHT, tgtNode)]

  const [topEnd, bottomEnd] = srcY < tgtY
    ? [calcOffset(DIRECTION.BOTTOM, srcNode), calcOffset(DIRECTION.TOP, tgtNode)]
    : [calcOffset(DIRECTION.TOP, srcNode), calcOffset(DIRECTION.BOTTOM, tgtNode)]

  const hDistance = calcDistanceOfEnds(leftEnd, rightEnd)
  const vDistance = calcDistanceOfEnds(topEnd, bottomEnd)
  const isHorizontalConnect = hDistance < vDistance
  const [srcEnd, tgtEnd] = isHorizontalConnect ? [leftEnd, rightEnd] : [topEnd, bottomEnd]
  // 如果节点处于旋转，需要计算旋转后的起始点位置
  if (srcAbsRotateDeg) {
    const coord = calcCoordAfterRotate({
      node: srcNode,
      deg: srcAbsRotateDeg,
      coord: {
        x: srcEnd.x - ((srcNode.relativeX || 0) + srcNode.width / 2),
        y: srcEnd.y - ((srcNode.relativeY || 0) + srcNode.height / 2),
      },
    })
    srcEnd.x = (srcNode.relativeX || 0) + coord.x
    srcEnd.y = (srcNode.relativeY || 0) + coord.y
  }

  // 如果节点处于旋转，需要计算旋转后的终点位置
  if (tgtAbsRotateDeg) {
    const coord = calcCoordAfterRotate({
      node: tgtNode,
      deg: tgtAbsRotateDeg,
      coord: {
        x: tgtEnd.x - ((tgtNode.relativeX || 0) + tgtNode.width / 2),
        y: tgtEnd.y - ((tgtNode.relativeY || 0) + tgtNode.height / 2),
      },
    })
    tgtEnd.x = (tgtNode.relativeX || 0) + coord.x
    tgtEnd.y = (tgtNode.relativeY || 0) + coord.y
  }

  // 贝塞尔曲线斜率
  const cOffset = 80
  // 正负性: positive or negative
  const pn = isHorizontalConnect ? (srcEnd.x < tgtEnd.x ? 1 : -1) : srcEnd.y < tgtEnd.y ? 1 : -1

  const pathD = isHorizontalConnect
    ? `M ${srcEnd.x} ${srcEnd.y} C ${srcEnd.x + pn * cOffset} ${srcEnd.y} ${tgtEnd.x - pn * cOffset} ${tgtEnd.y} ${tgtEnd.x} ${tgtEnd.y}`
    : `M ${srcEnd.x} ${srcEnd.y} C ${srcEnd.x} ${srcEnd.y + pn * cOffset} ${tgtEnd.x} ${tgtEnd.y - pn * cOffset} ${tgtEnd.x} ${tgtEnd.y}`
  const centerX = srcEnd.x + (tgtEnd.x - srcEnd.x) / 2
  const centerY = srcEnd.y + (tgtEnd.y - srcEnd.y) / 2

  return {
    pathD,
    centerX,
    centerY,
  }
}
