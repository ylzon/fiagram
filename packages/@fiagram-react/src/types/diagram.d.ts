import type { EdgeConfig, Edges } from './edges'
import type { NodeConfig, Nodes } from './nodes'

interface Shape {
  key?: string
  name?: string
  style?: Node['style']
  component?: (data) => JSX.Element
}

type Shapes = Shape[]

interface DiagramProps {
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
