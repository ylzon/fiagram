interface NodeLabelConfig {
  text?: string
  chunkLen?: number
  fontSize?: number
}

interface NodeStyle {
  fill: string
  stroke: string
  strokeWidth: number
}

interface Node {
  id: string
  x: number
  y: number
  width: number
  height: number
  shape: string
  label?: string | NodeLabelConfig
  style?: NodeStyle
  children?: Nodes
  [key: string]: unknown
}

export type Nodes = Node[]

interface NodeConfig {
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
  onClick?: (node: Node, state: any, dispatch: any) => void // 节点单击时回调
  onDblClick?: (node: Node, state: any, dispatch: any) => void // 节点双击时回调
  onContextMenu?: (node: Node, state: any, dispatch: any, options: any) => void // 节点右击时回调
  onDragEnd?: (node: Node, state: any, dispatch: any) => void // 节点拖动后回调，返回节点则更新位置，否则无变化
  renderUnExpandNode?: ({ ref, node, onExpand, defaultTextColor }: any) => ReactElement // 自定义盒子收起节点
}