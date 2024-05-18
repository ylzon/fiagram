import _ from 'lodash'
import { DIRECTION, EDGE_DISTANCE_GAP } from '../constant'
import { calcCoordAfterRotate } from './diagram.ts'
import type { PointsParams } from './connection-straight.ts'
import type { Vector } from './vectorUtil.ts'

/**
 * 根据连线对象，获取各个所需参数
 * @param entry 所有节点数据
 * @param exit 所有节点数据
 * @param source 起点节点id
 * @param sourceDirection  起点节点方向
 * @param target 结束节点
 * @param targetDirection 结束节点方向
 * @param entryExt 起点延申线长度
 * @param exitExt 终点延伸线长度
 * @returns {{entryDirection: S | Array, exitPoint: number[], entryPoint: number[], entryExt: number, exitExt: number, exitDirection: S | Array}}
 */
export function getEdgeParams({
  entry,
  exit,
  edge: { sourceDirection, targetDirection },
  srcAbsRotateDeg,
  tgtAbsRotateDeg,
  entryExt = EDGE_DISTANCE_GAP,
  exitExt = EDGE_DISTANCE_GAP,
}: any): PointsParams {
  // 根据方向，获取方向向量
  const positionMap = new Map<string, Vector>([
    [DIRECTION.TOP, [0, -1]],
    [DIRECTION.RIGHT, [1, 0]],
    [DIRECTION.BOTTOM, [0, 1]],
    [DIRECTION.LEFT, [-1, 0]],
  ])
  // 分别获取起点与终点的节点对象
  // const entry = findNodeFromTree(nodes, source);

  let [srcDirect, srcDirectOffset] = sourceDirection.split('|')
  let [tgtDirect, tgtDirectOffset] = targetDirection.split('|')

  entry.centerX = entry.width / 2 + entry.relativeX
  entry.centerY = entry.height / 2 + entry.relativeY
  // const exit = findNodeFromTree(nodes, target);
  exit.centerX = exit.width / 2 + exit.relativeX
  exit.centerY = exit.height / 2 + exit.relativeY
  // 分别获取起点和终点的方向向量

  const entryDirection: Vector = positionMap.get(srcDirect) || [0, 0]
  const exitDirection: Vector = positionMap.get(tgtDirect) || [0, 0]
  // 起点坐标的 = 起点中心坐标+方向向量*节点的半径
  const entryPoint: Vector = [
    entry.centerX + (entryDirection[0] * entry.width) / 2,
    entry.centerY + (entryDirection[1] * entry.height) / 2,
  ]

  if (srcDirectOffset) {
    const isInHorizonSide = _.includes([DIRECTION.LEFT, DIRECTION.RIGHT], srcDirect)

    if (srcDirectOffset < 1) {
      srcDirectOffset = isInHorizonSide
        ? srcDirectOffset * (entry.originHeight || entry.height)
        : srcDirectOffset * (entry.originWidth || entry.width)
    }
    const directIndex = isInHorizonSide ? 1 : 0
    const directCenter = isInHorizonSide ? entry.height / 2 : entry.width / 2

    if (entry.expand === false) {
      srcDirectOffset = isInHorizonSide
        ? (srcDirectOffset * entry.height) / (entry.originHeight || entry.height)
        : (srcDirectOffset * entry.width) / (entry.originWidth || entry.width)
    }

    entryPoint[directIndex] += +srcDirectOffset - directCenter
  }

  const exitPoint: Vector = [
    exit.centerX + (exitDirection[0] * exit.width) / 2,
    exit.centerY + (exitDirection[1] * exit.height) / 2,
  ]

  if (tgtDirectOffset) {
    const isInHorizonSide = _.includes([DIRECTION.LEFT, DIRECTION.RIGHT], tgtDirect)
    if (tgtDirectOffset < 1) {
      tgtDirectOffset = isInHorizonSide
        ? tgtDirectOffset * (exit.originHeight || exit.height)
        : tgtDirectOffset * (exit.originWidth || exit.width)
    }
    const directIndex = isInHorizonSide ? 1 : 0
    const directCenter = isInHorizonSide ? exit.height / 2 : exit.width / 2
    if (exit.expand === false) {
      tgtDirectOffset = isInHorizonSide
        ? (tgtDirectOffset * exit.height) / (exit.originHeight || exit.height)
        : (tgtDirectOffset * exit.width) / (exit.originWidth || exit.width)
    }
    exitPoint[directIndex] += +tgtDirectOffset - directCenter
  }

  if (srcAbsRotateDeg) {
    const coord = calcCoordAfterRotate({
      node: entry,
      deg: srcAbsRotateDeg,
      coord: {
        x: entryPoint[0] - (entry.relativeX + entry.width / 2),
        y: entryPoint[1] - (entry.relativeY + entry.height / 2),
      },
    })
    entryPoint[0] = entry.relativeX + coord.x
    entryPoint[1] = entry.relativeY + coord.y
  }
  if (tgtAbsRotateDeg) {
    const coord = calcCoordAfterRotate({
      node: exit,
      deg: tgtAbsRotateDeg,
      coord: {
        x: exitPoint[0] - (exit.relativeX + exit.width / 2),
        y: exitPoint[1] - (exit.relativeY + exit.height / 2),
      },
    })
    exitPoint[0] = exit.relativeX + coord.x
    exitPoint[1] = exit.relativeY + coord.y
  }
  return {
    entryPoint,
    entryDirection,
    entryExt,
    exitPoint,
    exitDirection,
    exitExt,
  }
}
