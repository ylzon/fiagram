export type Vector = [number, number]
/**
 * 向量相加 或者 向量与坐标相加
 * @param vectorA
 * @param vectorB
 * @returns *[]
 */
export const add = function (vectorA: Vector, vectorB: Vector): Vector {
  return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]]
}

/**
 * 向量乘以常量系数
 * @param vector
 * @param k
 * @returns number[]
 */
export const multiply = function (vector: Vector, k: number): Vector {
  return [vector[0] * k, vector[1] * k]
}

/**
 * 两点之间的向量，a点指向b点
 * @param pointA
 * @param pointB
 * @returns number[]
 */
export const vectorFromPoints = function (pointA: Vector, pointB: Vector): Vector {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]]
}

/**
 * 判断向量是否平行
 * @param vectorA
 * @param vectorB
 * @returns boolean
 */
export const isParallel = function (vectorA: Vector, vectorB: Vector) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0
}

/**
 * 向量点积
 * @param vectorA
 * @param vectorB
 * @returns number
 */
export const dot = function (vectorA: Vector, vectorB: Vector) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]
}
/**
 * 向量叉乘
 * @param vectorA
 * @param vectorB
 * @returns number
 */
export const cross = function (vectorA: Vector, vectorB: Vector) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0]
}

/**
 * 向量夹角
 * @param vector
 * @returns number
 */
export const angleFrom = function (vector: Vector) {
  return Math.acos(vector[0] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]))
}

/**
 * 获取向量的单位向量
 * @param vector
 * @returns number[]
 */
export const getUnitVector = function (vector: Vector): Vector {
  const m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  return [vector[0] / m, vector[1] / m]
}

/**
 * 判断向量 x,y 坐标相等
 * @param vector
 * @param target
 * @returns boolean
 */
export const equals = function (vector: Vector, target: Vector) {
  return vector[0] === target[0] && vector[1] === target[1]
}

/**
 * 获取两点水平获取垂直点的长度
 * @param vectorA
 * @param vectorB
 * @returns number
 */
export const getLen = function (vectorA: Vector, vectorB: Vector) {
  return vectorA[0] - vectorB[0] || vectorA[1] - vectorB[1]
}
