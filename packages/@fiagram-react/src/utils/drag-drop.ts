import type { XYCoord } from 'react-dnd'

/**
 * 获取拖动节点的样式
 * @param initialOffset
 * @param currentOffset
 */
export function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}
