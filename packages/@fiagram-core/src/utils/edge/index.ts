import _ from 'lodash'
import { findNode } from '../diagram'
import { EDGE_TYPE } from '../../constant'
import type { Nodes } from '../../../types/nodes'
import type { Edge } from '../../../types/edges'
import type { DiagramState } from '../../../types/diagram'
import { generateBrokenPath } from './edge-broken.ts'
import { generateCurvePath } from './edge-curve.ts'
import { generateDefaultPath } from './edge-default.ts'

/**
 * 批量计算Edges里的path
 * @param nodes
 * @param edges
 */
export function batchGenerateEdgePath(nodes: DiagramState['nodes'], edges: Edge) {
  return _.map(edges, edge => generateEdgePath(nodes || [], edge))
}

/**
 * 单个计算Edge的path
 * @param nodes
 * @param edge
 */
export function generateEdgePath(nodes: Nodes, edge: Edge) {
  const srcNode = findNode(nodes, edge.source)
  const tgtNode = findNode(nodes, edge.target)
  const edgeType = edge.type || EDGE_TYPE.STRAIGHT

  if (!srcNode || !tgtNode) {
    return { ...edge, pathD: '', centerX: 0, centerY: 0 }
  }

  // 阻止自身指向自身
  if (srcNode.id === tgtNode.id) {
    return { ...edge, pathD: '', centerX: 0, centerY: 0 }
  }

  const edgeInfo = {
    [EDGE_TYPE.STRAIGHT]: generateDefaultPath,
    [EDGE_TYPE.CURVE_AUTO]: generateCurvePath,
    [EDGE_TYPE.BROKEN]: generateBrokenPath,
    [EDGE_TYPE.BROKEN_ROUNDED]: generateBrokenPath,
  }
  return { ...edge, ...edgeInfo?.[edgeType]?.({ srcNode, tgtNode, edge }) }
}
