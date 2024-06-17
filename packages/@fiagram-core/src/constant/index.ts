export const DRAG_DROP_KEY = 'DragDropBox'

export const DIRECTION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
} as const

export const ALIGN_DIRECT = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  HORIZON: 'horizon',
  VERTICAL: 'vertical',
} as const

export const EDGE_TYPE = {
  STRAIGHT: 'straight',
  CURVE_AUTO: 'curve-auto',
  BROKEN: 'broken',
  BROKEN_ROUNDED: 'broken-rounded',
} as const

export const ARROW_TYPE = {
  SINGLE_ARROW: 'SINGLE_ARROW',
  DOUBLE_ARROW: 'DOUBLE_ARROW',
} as const

export const SEGMENT_DIRECTION = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
} as const

export const MODE = {
  NORMAL: 'normal',
  ADVANCE: 'advance',
} as const

export const KEY_CODES = {
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  Delete: 46,
  Backspace: 8,
} as const

export const unexpandWidth = 52
export const unexpandHeight = 52
export const expandIconWidth = 14

export const EDGE_DISTANCE_GAP = 10

export const MovingEdgeAnchorStatusClass = 'move-edge-anchor'

export const extractNumberRegex = /[+-]?\d+(\.\d+)?/g
export const floatOrIntegerReg = /(-\d+(\.\d+)?)|(\d+(\.\d+)?)/g

export const MIN_SCALE = 0.1
export const MAX_SCALE = 10

export const DURATION = 1000

export const maxTitleWidth = 120
