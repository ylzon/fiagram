import type { EdgeConfig, Edges } from './edges'
import type { Node, NodeConfig, Nodes } from './nodes'

export interface Size { width: number, height: number }

export interface Shape {
  shape?: string
  label?: string
  style?: Node['style']
  component?: (data: Node) => JSX.Element
  nodeInfo?: Node
}

export type Shapes = Shape[]

export interface SvgInfo {
  svg?: Selection<SVGElement, undefined, HTMLElement, any>
  svgDOM?: SVGSVGElement | null
  svgZoomArea?: Selection<SVGElement, undefined, HTMLElement, any>
  auxiliary?: Selection<SVGElement, undefined, HTMLElement, any>
  zoom?: Selection<SVGElement, undefined, HTMLElement, any>
  marqueeSelect?: Selection<SVGElement, undefined, HTMLElement, any>
  marqueeSelectCopy?: Selection<SVGElement, undefined, HTMLElement, any>
  newLine?: Selection<SVGPathElement, undefined, HTMLElement, any>
  [key: string]: any
}

export type XYCoord = { x: number, y: number }

/**
 * 本地存储的画布内部全局状态
 */
export interface DiagramState {
  width: Size['width'] // 画布宽度
  height: Size['height'] // 画布高度
  nodes: Nodes // 画布上的节点
  edges: Edges // 画布上的连线
  backupData: { nodes: Nodes, edges: Edges }[] // 用于撤销操作时，记录上次图数据
  svgInfo: SvgInfo // svg dom相关记录
  selectedNodes: Nodes // 点中节点
  selectedEdges: Edges // 点中连线
  marqueeNodes: Nodes // 框选中节点
  copyNode: Node | null // 拷贝的节点
  targetInfo: Node | null // 建立连线标记目标节点
  gaussianBlur: number
  centroidTick: number // 自动居中图行触发器
  uniqId: string // 用于生成拖拽区域的唯一id
  edgeProps: EdgeConfig // 连线属性
  zoomConfig?: (zoomAreaEl: Selection<SVGElement, undefined, HTMLElement, any>) => any // 缩放配置
}

/**
 * Diagram 组件的参数
 */
export interface DiagramProps {
  nodes?: Nodes // 图中的节点数据
  edges?: Edges // 图中的连线数据
  nodeProps?: NodeConfig // 图中节点数据的属性信息，用于控制如何展示，事件绑定等
  edgeProps?: EdgeConfig // 图中连线数据的属性信息，用于控制如何展示，事件绑定等
  shapes?: Shapes // 用于传入自定义的渲染图形
  hideDragBox?: boolean // 隐藏拖动栏
  hideTools?: boolean // 隐藏工具栏
  wheelZoomDisabled?: boolean // 禁止鼠标滚轮缩放
  dragZoomDisabled?: boolean // 禁止鼠标拖动缩放
  copyNodeDisabled?: boolean // 禁止 `ctrl+c/v` 拷贝/复制节点
  hideGrid?: boolean // 不显示网格
  withoutCenter?: boolean // 不自动居中图形
  style?: any // 画布样式
  className?: string // 画布 class 名称
  canvasStyle?: any // svg 样式
  canvasClassName?: string // svg class 名称
  gaussianBlur?: number // 高亮时背景模糊度
  onDelete?: () => void // 删除节点/连线时回调
  onLoad?: () => void // 画布加载结束时回调
  mode?: string // 控制组件的功能范围
  theme?: any // 定制主题
}
