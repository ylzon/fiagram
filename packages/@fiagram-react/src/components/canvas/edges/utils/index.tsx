import React from 'react'

/**
 * 绘制标记
 * @param markerId
 * @param color
 */
export function defMarker(markerId: string, color?: string) {
  const ARROW_PATH = 'M6,4 L9,6 L6,8 L6,4'
  const DOUBLE_ARROW_PATH = 'M11,4 L8,6 L11,8 L11,4'
  return (
    <defs>
      <marker id={markerId} markerWidth="12" markerHeight="12" refX="8.5" refY="6" orient="auto">
        <path d={ARROW_PATH} fill={color} />
      </marker>
      <marker
        id={`DOUBLE-${markerId}`}
        markerWidth="12"
        markerHeight="12"
        refX="8.5"
        refY="6"
        orient="auto"
      >
        <path d={DOUBLE_ARROW_PATH} fill={color} />
      </marker>
    </defs>
  )
}
