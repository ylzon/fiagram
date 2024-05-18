import { calcOffset } from '../diagram.ts'
import type { Node } from '../../../types/nodes'
import type { Edge } from '../../../types/edges'

export type EdgeInfo = {
  pathD: string
  centerX: number
  centerY: number
}

export type CalcEdgePathParams = (params: {
  srcNode: Node
  tgtNode: Node
  edge?: Edge
}) => EdgeInfo

export const generateDefaultPath: CalcEdgePathParams = ({ srcNode, tgtNode, edge }) => {
  // 计算源/目标节点的绝对旋转角度
  const srcAbsRotateDeg = srcNode.absRotateDeg
  const tgtAbsRotateDeg = tgtNode.absRotateDeg
  const srcOffset = calcOffset(edge?.sourceDirection, srcNode, srcAbsRotateDeg)
  const tgtOffset = calcOffset(edge?.targetDirection, tgtNode, tgtAbsRotateDeg)
  return {
    centerX: srcOffset.x + (tgtOffset.x - srcOffset.x) / 2,
    centerY: srcOffset.y + (tgtOffset.y - srcOffset.y) / 2,
    pathD: `M ${srcOffset.x},${srcOffset.y} L ${tgtOffset.x},${tgtOffset.y}`,
  }
}
