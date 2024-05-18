import type { Vector } from './vectorUtil.ts'
import { add, dot, getUnitVector, isParallel, multiply, vectorFromPoints } from './vectorUtil.ts'

// 中线智能 避让

// let turnRatio = 0.5

// 描述方向 使用svg 平面轴 上：[0,-1] 右：[1,0] 下 [0,1] 左 [-1,0]

export interface PointsParams {
  entryPoint?: Vector
  entryDirection?: Vector
  exitPoint?: Vector
  exitDirection?: Vector
  entryExt?: number
  exitExt?: number
}
/**
 * path 指除了延申线之外的连接线
 * @param entryPoint 起点坐标
 * @param entryDirection 起点方向（单位向量）
 * @param entryExt 起点延申线长度
 * @param exitPoint 终点坐标
 * @param exitDirection 终点方向
 * @param exitExt 终点延伸线
 * @param turnRatio ? 折弯处比例
 * @returns {*[]}  [起点，正交线的起点，...正交线的转弯点，正交线的终点，终点]
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
  // 1. 获得入方向和出方向 ——参数中已获得; 当exitDirection 未定义时
  if (exitDirection === null || exitDirection.join() === '0,0') {
    const entryToExit = vectorFromPoints(exitPoint, entryPoint)
    if (Math.abs(entryToExit[0]) > Math.abs(entryToExit[1])) {
      exitDirection = [entryToExit[0] / Math.abs(entryToExit[0]), 0]
    } else {
      exitDirection = [0, entryToExit[1] / Math.abs(entryToExit[1])]
    }
  }

  // 2. 获得直接 path 的水平和竖直方向
  const pathStartP = add(entryPoint, multiply(entryDirection, entryExt))
  const pathEndP = add(exitPoint, multiply(exitDirection, exitExt))

  // 出口方向需要取反
  exitDirection = multiply(exitDirection, -1)

  // 直接path的向量
  // let pathVec = vectorFromPoints(pathEndP,pathStartP);
  // path的水平向量
  const pathHorizonVec: Vector = [pathEndP[0] - pathStartP[0], 0]
  // path 的竖直向量
  const pathVerticalVec: Vector = [0, pathEndP[1] - pathStartP[1]]

  // 3.计算path 的起始方向： 两方向与入方向平行的一项，如果是同向则取之，反之则取非平行的一项
  const comp = [pathHorizonVec, pathVerticalVec]
  let pathStart: Vector
  const startParallelVec: Vector = comp.find(vec => isParallel(vec, entryDirection)) || [0, 0]

  if (dot(startParallelVec, entryDirection) > 0) {
    pathStart = startParallelVec
  } else {
    pathStart = anotherOne(comp, startParallelVec)
  }

  // 4.计算path 的末方向： 两方向与末方向平行的一项，如果是同向则取之，反之则取非平行的一项
  let pathEnd: Vector
  const endParallelVec = comp.find(vec => isParallel(vec, exitDirection)) || [0, 0]

  if (dot(endParallelVec, exitDirection) > 0) {
    pathEnd = endParallelVec
  } else {
    pathEnd = anotherOne(comp, endParallelVec)
  }

  // 5.如果path的起末为同方向，则分为两段，否则为1段
  const splitNum = dot(pathStart, pathEnd) > 0 ? 2 : 1

  const pathMiddle = anotherOne(comp, pathEnd)

  // 6.计算path中的转折点 返回数据中加入了单位向量
  const points = []
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
  points.push({
    position: exitPoint,
    direction: exitDirection,
  })

  const newPoints = points.filter(v => v.direction !== false)

  // 长度为3时，可能时算法计算出的错误结果，没有加上终点的偏移量，需要手动的加上
  if (newPoints.length === 3) {
    const lastPoint = JSON.parse(JSON.stringify(newPoints[2]))
    lastPoint.position = [lastPoint.position[0] + exitExt, lastPoint.position[1]]
    // 加上终点的偏移量
    newPoints.splice(2, 0, lastPoint)
    // 添加可正确被拖拽的点
    newPoints.splice(2, 0, newPoints[1], newPoints[2])
  }
  if (newPoints.length === 5) {
    // 五个点在同一水平或垂直的直线上
    // index为2的点在线的中心，替换成线的两端的点，这样就可以使PathHandler正确的拖拽线条
    if (
      newPoints.every(item => item.position[0] === newPoints[0].position[0])
      || newPoints.every(item => item.position[1] === newPoints[0].position[1])
    ) {
      newPoints.splice(2, 1, newPoints[1], newPoints[3])
    } else {
      /*
      存在以下四种情况
      一   二   三    四
      *4   0*   10*  210
      03   14   234  34*
      12   23
      */
      // 一，二
      if (newPoints[0].position[0] === newPoints[1].position[0]) {
        // 二
        if (newPoints[2].position[0] === newPoints[0].position[0]) {
          newPoints.splice(3, 0, newPoints[3])
        } else {
          //  一
          newPoints.splice(2, 0, newPoints[1])
        }
        //  三，四
      } else if (newPoints[0].position[1] === newPoints[1].position[1]) {
        // 四
        if (newPoints[2].position[1] === newPoints[0].position[1]) {
          newPoints.splice(3, 0, newPoints[3])
        } else {
          //  三
          newPoints.splice(2, 0, newPoints[1])
        }
      }
    }
  }
  return newPoints
}

// 两个元素的数组中的另一个
function anotherOne(comp: Vector[], a: Vector): Vector {
  return comp.find((v: any) => v !== a) || [0, 0]
}

// 获取竖直和水平向量的单位向量
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
