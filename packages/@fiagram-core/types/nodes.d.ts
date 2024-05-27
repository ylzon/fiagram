export interface NodeLabelConfig {
  text?: string
  chunkLen?: number
  fontSize?: number
}

export interface NodeStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  fillColor?: string
  strokeColor?: string
}

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export interface Node {
  id?: string
  x?: number
  y?: number
  width: number
  height: number
  shape?: string
  relativeX?: number
  relativeY?: number
  translateX?: number
  translateY?: number
  rotateDeg?: number
  // label?: string | NodeLabelConfig
  label?: string
  className?: string
  style?: NodeStyle
  children?: Nodes
  connectDisabled?: boolean
  resizeDisabled?: boolean
  rotateDisabled?: boolean
  dragDisabled?: boolean
  [key: string]: any
}

export type Nodes = Node[]

export interface NodeConfig {
  resizeDisabled?: boolean // 禁止修改节点大小
  connectDisabled?: boolean // 禁止节点连线
  dragDisabled?: boolean // 禁止节点拖动
  dragInDisabled?: boolean // 禁止拖动子节点
  rotateDisabled?: boolean // 禁止节点旋转
  keyboardMoveEnable?: boolean // 允许方向键移动节点
  labelProps?: NodeLabelConfig // 节点名称属性
  beforeInsert?: (newNode: Node) => void // 拖入节点前回调
  beforeConnect?: (newEdge: any, callback: () => void) => void // 建立节点间连线前回调
  afterConnect?: (newEdge: any) => void // 建立节点间连线后回调
  beforeResize?: (newNode: Node, rect: Rect) => Rect // 节点缩放前回调
  afterResize?: (newNode: Node, rect: Rect) => Rect // 节点缩放后回调
  onClick?: (node: Node, state: any, dispatch: any) => void // 节点单击时回调
  onDblClick?: (node: Node, state: any, dispatch: any) => void // 节点双击时回调
  onContextMenu?: (node: Node, state: any, dispatch: any, options: any) => void // 节点右击时回调
  onDragEnd?: (node: Node, state: any, dispatch: any) => void // 节点拖动后回调，返回节点则更新位置，否则无变化
  renderUnExpandNode?: ({ ref, node, onExpand, defaultTextColor }: any) => any // 自定义盒子收起节点
}
