import type { Vector } from './vectorUtil.ts'
import { add, dot, getUnitVector, isParallel, multiply, vectorFromPoints } from './vectorUtil.ts'

/**
 * 正交折线连接算法（Orthogonal Connector Routing）
 *
 * 本模块用于在两个节点之间生成正交（仅水平/垂直线段）的折线连接路径。
 * 算法会根据起点/终点的位置和方向，智能计算中间转折点，实现自动避让和美观布线。
 *
 * 坐标系说明（SVG 平面坐标系）：
 *   - 上：[0, -1]
 *   - 右：[1, 0]
 *   - 下：[0, 1]
 *   - 左：[-1, 0]
 */

/** 连接点参数接口 */
export interface PointsParams {
  /** 起点坐标 */
  entryPoint?: Vector
  /** 起点连接方向（单位向量，表示从节点向外延伸的方向） */
  entryDirection?: Vector
  /** 终点坐标 */
  exitPoint?: Vector
  /** 终点连接方向（单位向量，表示从节点向外延伸的方向） */
  exitDirection?: Vector
  /** 起点延伸线长度（从节点表面到正交路径起点的间距） */
  entryExt?: number
  /** 终点延伸线长度（从节点表面到正交路径终点的间距） */
  exitExt?: number
}

/**
 * 生成两节点间的正交折线连接点序列。
 *
 * 连接线结构：起点 → 延伸段 → 正交路径（含若干转折点）→ 延伸段 → 终点
 *
 * @param params - 连接参数
 * @param params.entryPoint - 起点坐标，默认 [0, 0]
 * @param params.entryDirection - 起点连接方向（单位向量），默认 [0, 1]
 * @param params.exitPoint - 终点坐标，默认 [10, 10]
 * @param params.exitDirection - 终点连接方向（单位向量），默认 [1, 0]
 * @param params.entryExt - 起点延伸线长度，默认 10
 * @param params.exitExt - 终点延伸线长度，默认 10
 * @param turnRatio - 折弯位置比例（0~1），控制同向路径时的转折偏移量，默认 0.5 表示中点转折
 * @returns 有序的连接点数组，每个元素包含 { position: 坐标, direction: 该段方向的单位向量 }
 */
function generateConnectionPoints(
  {
    entryPoint = [0, 0],
    entryDirection = [0, 1],
    exitPoint = [10, 10],
    exitDirection = [1, 0],
    entryExt = 10,
    exitExt = 10,
  }: PointsParams = {},
  turnRatio = 0.5,
): any[] {
  // Step 1: 处理终点方向未定义的情况
  // 当 exitDirection 为 null 或零向量时，根据起终点的相对位置自动推断终点方向
  // 选取水平/垂直分量中较大的一个作为主方向
  if (exitDirection === null || exitDirection.join() === '0,0') {
    const entryToExit = vectorFromPoints(exitPoint, entryPoint)
    if (Math.abs(entryToExit[0]) > Math.abs(entryToExit[1])) {
      exitDirection = [entryToExit[0] / Math.abs(entryToExit[0]), 0]
    } else {
      exitDirection = [0, entryToExit[1] / Math.abs(entryToExit[1])]
    }
  }

  // Step 2: 计算正交路径的起止点
  // pathStartP：从起点沿 entryDirection 延伸 entryExt 后的位置（正交路径起点）
  // pathEndP：从终点沿 exitDirection 延伸 exitExt 后的位置（正交路径终点）
  const pathStartP = add(entryPoint, multiply(entryDirection, entryExt))
  const pathEndP = add(exitPoint, multiply(exitDirection, exitExt))

  // 将终点方向取反：exitDirection 原本表示"从节点向外"的方向，
  // 取反后表示"从路径进入节点"的方向，用于后续路径末段方向匹配
  exitDirection = multiply(exitDirection, -1)

  // 将正交路径向量分解为水平分量和垂直分量
  const pathHorizonVec: Vector = [pathEndP[0] - pathStartP[0], 0]
  const pathVerticalVec: Vector = [0, pathEndP[1] - pathStartP[1]]

  // Step 3: 确定正交路径的起始段方向
  // 在水平分量和垂直分量中，找到与入口方向平行的分量：
  //   - 若该分量与入口方向同向（点积 > 0），则作为起始段方向
  //   - 若反向，则选另一个分量（保证路径不回折）
  const comp = [pathHorizonVec, pathVerticalVec]
  let pathStart: Vector
  const startParallelVec: Vector = comp.find(vec => isParallel(vec, entryDirection)) || [0, 0]

  if (dot(startParallelVec, entryDirection) > 0) {
    pathStart = startParallelVec
  } else {
    pathStart = anotherOne(comp, startParallelVec)
  }

  // Step 4: 确定正交路径的末段方向（逻辑同 Step 3，基于出口方向匹配）
  let pathEnd: Vector
  const endParallelVec = comp.find(vec => isParallel(vec, exitDirection)) || [0, 0]

  if (dot(endParallelVec, exitDirection) > 0) {
    pathEnd = endParallelVec
  } else {
    pathEnd = anotherOne(comp, endParallelVec)
  }

  // Step 5: 判断路径是否需要额外分段
  // 若起始段和末段同向（点积 > 0），需要拆成 2 段 + 中间过渡段（共 3 段折线）
  // 若不同向，则只需 1 次转折（共 2 段折线）
  const splitNum = dot(pathStart, pathEnd) > 0 ? 2 : 1

  // 中间段方向 = 与末段方向垂直的那个分量
  const pathMiddle = anotherOne(comp, pathEnd)

  // Step 6: 构建完整的连接点序列
  const points = []

  // 添加起点和延伸段终点
  points.push(
    {
      position: entryPoint,
      direction: null,
    },
    {
      position: pathStartP,
      direction: entryDirection,
    },
  )

  if (splitNum === 1) {
    // 单次转折：pathStartP → (沿 pathStart 方向) → 转折点 → (沿 pathEnd 方向) → pathEndP
    const point1 = add(pathStartP, pathStart)
    const dir1 = getUnitVecByStraight(pathStart)
    const point2 = add(point1, pathEnd)
    const dir2 = getUnitVecByStraight(pathEnd)
    points.push(
      {
        position: point1,
        direction: dir1,
      },
      {
        position: point2,
        direction: dir2,
      },
    )
  } else {
    // 双次转折：通过 turnRatio 控制折弯位置
    // 路径形态：pathStartP → point1 → point2 → point3 → pathEndP
    //   point1 = pathStartP 沿起始方向偏移 turnRatio 比例
    //   point2 = point1 沿中间段方向偏移（完整跨越）
    //   point3 = point2 沿末段方向偏移 (1 - turnRatio) 比例
    const point1 = add(pathStartP, multiply(pathStart, turnRatio))
    const dir1 = getUnitVecByStraight(pathStart)

    const point2 = add(point1, pathMiddle)
    const dir2 = getUnitVecByStraight(pathMiddle)
    const point3 = add(point2, multiply(pathEnd, 1 - turnRatio))
    const dir3 = getUnitVecByStraight(pathEnd)

    points.push(
      {
        position: point1,
        direction: dir1,
      },
      {
        position: point2,
        direction: dir2,
        type: 'pathMiddleP',
      },
      {
        position: point3,
        direction: dir3,
      },
    )
  }

  // 添加终点
  points.push({
    position: exitPoint,
    direction: exitDirection,
  })

  // 过滤掉方向为 false 的无效点（由零向量产生）
  const newPoints = points.filter(v => v.direction !== false)

  // ===== 边界情况修正 =====

  // 修正 1：当结果仅 3 个点时，说明算法退化（起终点过近或特殊对齐情况）
  // 此时缺少终点延伸偏移，需手动补充，并插入额外控制点以支持拖拽交互
  if (newPoints.length === 3) {
    const lastPoint = JSON.parse(JSON.stringify(newPoints[2]))
    lastPoint.position = [lastPoint.position[0] + exitExt, lastPoint.position[1]]
    newPoints.splice(2, 0, lastPoint)
    // 插入重复点，确保 PathHandler 可正确识别并拖拽线段
    newPoints.splice(2, 0, newPoints[1], newPoints[2])
  }

  // 修正 2：当结果为 5 个点时，处理特殊布局场景
  if (newPoints.length === 5) {
    // 情况 A：所有点共线（全在同一水平线或垂直线上）
    // 将中心点替换为两端点的副本，以支持 PathHandler 拖拽交互
    if (
      newPoints.every(item => item.position[0] === newPoints[0].position[0])
      || newPoints.every(item => item.position[1] === newPoints[0].position[1])
    ) {
      newPoints.splice(2, 1, newPoints[1], newPoints[3])
    } else {
      // 情况 B：非共线的四种 L 形/Z 形布局
      // 根据起点与第二点的对齐轴（X轴或Y轴），以及第三点的位置关系，
      // 插入额外点以确保 PathHandler 可正确拖拽每段线条
      //
      // 四种布局示意（数字为点序号，* 为节点）：
      //   一     二     三      四
      //   *4    0*    10*    210
      //   03    14    234    34*
      //   12    23

      if (newPoints[0].position[0] === newPoints[1].position[0]) {
        // 起点与第二点在同一垂直线上（情况一 或 情况二）
        if (newPoints[2].position[0] === newPoints[0].position[0]) {
          // 情况二：第三点也在同一垂直线上
          newPoints.splice(3, 0, newPoints[3])
        } else {
          // 情况一：第三点不在同一垂直线上
          newPoints.splice(2, 0, newPoints[1])
        }
      } else if (newPoints[0].position[1] === newPoints[1].position[1]) {
        // 起点与第二点在同一水平线上（情况三 或 情况四）
        if (newPoints[2].position[1] === newPoints[0].position[1]) {
          // 情况四：第三点也在同一水平线上
          newPoints.splice(3, 0, newPoints[3])
        } else {
          // 情况三：第三点不在同一水平线上
          newPoints.splice(2, 0, newPoints[1])
        }
      }
    }
  }

  return newPoints
}

/**
 * 从二元组中获取另一个元素。
 * 用于在 [水平分量, 垂直分量] 中选取与当前分量不同的那个。
 */
function anotherOne(comp: Vector[], a: Vector): Vector {
  return comp.find((v: any) => v !== a) || [0, 0]
}

/**
 * 获取轴对齐向量的单位向量。
 * - 零向量 → 返回 false（标记为无效方向，后续会被过滤）
 * - 纯水平/纯垂直向量 → 直接归一化为 ±1
 * - 非轴对齐向量 → 回退到通用的单位向量计算
 */
function getUnitVecByStraight(vector: Vector) {
  if (vector[0] === 0 && vector[1] === 0) {
    return false
  } else if (vector[0] === 0) {
    return [0, vector[1] / Math.abs(vector[1])]
  } else if (vector[1] === 0) {
    return [vector[0] / Math.abs(vector[0]), 0]
  } else {
    return getUnitVector(vector)
  }
}

export default generateConnectionPoints
