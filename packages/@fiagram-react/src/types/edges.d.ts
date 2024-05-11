import type { ReactElement } from 'react'
import type React from 'react'

type EdgeDirection = 'top' | 'right' | 'bottom' | 'left'
type EdgeType = 'straight' | 'straight-auto' | 'curve-auto' | 'broken' | 'broken-rounded'

interface EdgeStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  strokeColor?: string
  textColor?: string
  fontSize?: number
  fillColor: string
}

interface EdgeLabelConfig extends React.SVGProps<SVGRectElement> {
  text?: string
  offsetDistance?: number // 标签相对连线起始位置(百分比) 0 - 100
  rectStyle?: EdgeStyle // 背景框样式
  textStyle?: EdgeStyle // 文字样式
  textColor?: string // 文字颜色
  onClick?: (edge: Edge, state: any, dispatch: any) => void // 连线标签单击时回调
  onDblClick?: (edge: Edge, state: any, dispatch: any) => void // 连线标签双击时回调
  onContextMenu?: (edge: Edge, state: any, dispatch: any, options: any) => void // 连线标签右击时回调
}

interface Edge {
  id?: string // 连线 id
  type?: EdgeType // 连线类型
  label?: string // 连线标签属性
  labelProps?: EdgeLabelConfig
  source?: string // 连线源节点 id
  target?: string // 连线目标节点 id
  sourceDirection?: EdgeDirection // 连线源节点锚点
  targetDirection?: EdgeDirection // 连线目标节点锚点
  style?: EdgeStyle // 连线样式
  pathD?: string // 连线路径
  [key: string]: any // 其他任意属性
}

export type Edges = Edge[]

interface EdgeConfig {
  style?: EdgeStyle // 连线样式
  defaultEdgeStyle?: EdgeStyle // 建立连线时默认的连线样式
  defaultNewEdgeStyle?: EdgeStyle // 建立连线时默认的连线样式
  renderEdgeBase?: ({ edge, path }: any, edgeParams) => ReactElement // 自定义连线实现
  renderEdge?: ({ edge, path }: any) => ReactElement // 自定义连线实现
  onClick?: (edge: Edge, state: any, dispatch: any) => void // 连线单击时回调
  onDblClick?: (edge: Edge, state: any, dispatch: any) => void // 连线双击时回调
  onContextMenu?: (edge: Edge, state: any, dispatch: any, options: any) => void // 连线右击时回调
}
