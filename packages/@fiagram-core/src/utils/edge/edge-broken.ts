import { EDGE_TYPE } from '../../constant'
import { getEdgeParams } from '../getPathPoints.ts'
import generateConnectionPoints from '../connection-straight.ts'
import type { CalcEdgePathParams } from './edge-default.ts'

export const generateBrokenPath: CalcEdgePathParams = ({ srcNode, tgtNode, edge }) => {
  const edgeType = edge?.type || EDGE_TYPE.STRAIGHT
  const { absRotateDeg: srcRotate, absRotateDeg: tgtRotate } = srcNode
  const edgeParams = getEdgeParams({ entry: srcNode, exit: tgtNode, edge, srcRotate, tgtRotate })
  const pathPoints = generateConnectionPoints(edgeParams)
  const OFFSET = 8

  let pathD = ''
  let isHorizontalEnough = false
  let isVerticalEnough = false

  pathPoints.forEach((point, index) => {
    if (index > 0) {
      const prevPoint = pathPoints[index - 1]
      const [x, y] = prevPoint.position
      const [nx, ny] = point.position

      isHorizontalEnough ||= Math.abs(nx - x) > OFFSET
      isVerticalEnough ||= Math.abs(ny - y) > OFFSET

      const [pDx, pDy] = prevPoint.direction || [0, 0]
      const [nDx, nDy] = point.direction || [0, 0]

      if (edgeType === EDGE_TYPE.BROKEN_ROUNDED && isHorizontalEnough && isVerticalEnough && (pDx !== nDx || pDy !== nDy)) {
        pathD += nDy === 0
          ? `L ${x} ${y - pDy * OFFSET} Q ${x} ${y} ${x + nDx * OFFSET} ${y}`
          : `L ${x - pDx * OFFSET} ${y} Q ${x} ${y} ${x} ${y + nDy * OFFSET}`
      } else {
        pathD += `L ${x} ${y}`
      }
    } else {
      pathD = `M ${point.position[0]} ${point.position[1]}`
    }
  })

  const lastPoint = pathPoints[pathPoints.length - 1]?.position || []
  pathD += `L ${lastPoint[0]} ${lastPoint[1]}`

  const middleIndex = pathPoints.findIndex(p => p.type === 'pathMiddleP') || Math.floor(pathPoints.length / 2)
  const middlePoint = pathPoints[middleIndex].position
  const prevMiddlePoint = pathPoints[middleIndex - 1].position
  const centerX = prevMiddlePoint[0] + (middlePoint[0] - prevMiddlePoint[0]) / 2
  const centerY = prevMiddlePoint[1] + (middlePoint[1] - prevMiddlePoint[1]) / 2

  return { pathD, centerX, centerY }
}
