---
title: API 参考
order: 2
nav:
  title:  API
  order: 1
---

# API 参考

## Diagram Props

`<Diagram>` 组件支持以下属性：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `nodes` | `Node[]` | — | 画布上的节点数据 |
| `edges` | `Edge[]` | — | 画布上的连线数据 |
| `shapes` | `Shape[]` | — | 自定义渲染图形的注册列表 |
| `nodeProps` | `NodeConfig` | — | 节点全局配置（行为控制、事件回调等） |
| `edgeProps` | `EdgeConfig` | — | 连线全局配置（样式、事件回调等） |
| `hideTools` | `boolean` | `false` | 隐藏顶部工具栏 |
| `hideDragBox` | `boolean` | `false` | 隐藏左侧拖拽面板 |
| `hideGrid` | `boolean` | `false` | 隐藏网格背景 |
| `wheelZoomDisabled` | `boolean` | `false` | 禁止鼠标滚轮缩放 |
| `dragZoomDisabled` | `boolean` | `false` | 禁止鼠标拖拽画布 |
| `scaleExtent` | `[number, number]` | `[0.1, 10]` | 缩放范围 |
| `copyNodeDisabled` | `boolean` | `false` | 禁止 Ctrl+C/V 复制节点 |
| `withoutCenter` | `boolean` | `false` | 禁止自动居中 |
| `gaussianBlur` | `number` | — | 高亮时的背景模糊度 |
| `mode` | `'normal' \| 'advance'` | `'normal'` | 组件功能范围模式 |
| `style` | `CSSProperties` | — | 容器样式 |
| `className` | `string` | — | 容器 class |
| `canvasStyle` | `CSSProperties` | — | SVG 画布样式 |
| `canvasClassName` | `string` | — | SVG 画布 class |
| `onLoad` | `() => void` | — | 画布加载完成回调 |
| `onDelete` | `() => void` | — | 删除节点/连线时回调 |
| `theme` | `object` | — | 自定义主题 |

## Shape 定义

通过 `shapes` 属性注册自定义图形：

| 属性 | 类型 | 说明 |
|---|---|---|
| `shape` | `string` | 图形唯一标识名称 |
| `label` | `string` | 拖拽面板中显示的标签 |
| `nodeInfo` | `Node` | 默认节点信息（宽高等） |
| `component` | `(data: Node) => JSX.Element` | 渲染函数，接收节点数据并返回 SVG 组件 |

## Node 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 节点唯一 ID |
| `x` | `number` | X 坐标 |
| `y` | `number` | Y 坐标 |
| `width` | `number` | 节点宽度 |
| `height` | `number` | 节点高度 |
| `shape` | `string` | 使用的图形名称（对应 Shape 的 `shape` 字段） |
| `label` | `string` | 节点标签 |
| `className` | `string` | 节点 class |
| `style` | `NodeStyle` | 节点样式（`fill`, `stroke`, `strokeWidth` 等） |
| `children` | `Node[]` | 子节点（用于嵌套容器） |
| `connectDisabled` | `boolean` | 禁止该节点建立连线 |
| `resizeDisabled` | `boolean` | 禁止调整大小 |
| `rotateDisabled` | `boolean` | 禁止旋转 |
| `dragDisabled` | `boolean` | 禁止拖动 |

## NodeConfig

通过 `nodeProps` 对所有节点进行全局配置：

| 属性 | 类型 | 说明 |
|---|---|---|
| `resizeDisabled` | `boolean` | 禁止修改节点大小 |
| `connectDisabled` | `boolean` | 禁止节点连线 |
| `dragDisabled` | `boolean` | 禁止节点拖动 |
| `dragInDisabled` | `boolean` | 禁止拖入子节点 |
| `rotateDisabled` | `boolean` | 禁止节点旋转 |
| `keyboardMoveEnable` | `boolean` | 允许方向键移动节点 |
| `labelProps` | `NodeLabelConfig` | 节点名称配置 |
| `beforeInsert` | `(newNode) => void` | 拖入节点前回调 |
| `beforeConnect` | `(newEdge, callback) => void` | 建立连线前回调（可通过 callback 确认） |
| `afterConnect` | `(newEdge) => void` | 建立连线后回调 |
| `beforeResize` | `(node, rect) => Rect` | 缩放前回调，返回新尺寸 |
| `afterResize` | `(node, rect) => Rect` | 缩放后回调，返回新尺寸 |
| `onClick` | `(node, state, dispatch) => void` | 节点单击事件 |
| `onDblClick` | `(node, state, dispatch) => void` | 节点双击事件 |
| `onContextMenu` | `(node, state, dispatch, options) => void` | 节点右键菜单事件 |
| `onDragEnd` | `(node, state, dispatch) => void` | 节点拖拽结束事件 |

## Edge 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 连线唯一 ID |
| `type` | `EdgeType` | 连线类型：`straight` / `curve-auto` / `broken` / `broken-rounded` |
| `label` | `string` | 连线标签文字 |
| `labelProps` | `EdgeLabelConfig` | 连线标签详细配置 |
| `source` | `string` | 起始节点 ID |
| `target` | `string` | 目标节点 ID |
| `sourceDirection` | `EdgeDirection` | 起始方向：`top` / `bottom` / `left` / `right` |
| `targetDirection` | `EdgeDirection` | 目标方向：`top` / `bottom` / `left` / `right` |
| `style` | `EdgeStyle` | 连线样式 |

## EdgeConfig

通过 `edgeProps` 对所有连线进行全局配置：

| 属性 | 类型 | 说明 |
|---|---|---|
| `style` | `EdgeStyle` | 连线默认样式 |
| `labelProps` | `EdgeLabelConfig` | 连线标签默认配置 |
| `defaultEdgeStyle` | `EdgeStyle` | 新建连线时的默认样式 |
| `renderEdge` | `({ edge, path }) => any` | 自定义连线渲染 |
| `onClick` | `(edge, state, dispatch) => void` | 连线单击事件 |
| `onDblClick` | `(edge, state, dispatch) => void` | 连线双击事件 |
| `onContextMenu` | `(edge, state, dispatch, options) => void` | 连线右键菜单事件 |

## EdgeLabelConfig

| 属性 | 类型 | 说明 |
|---|---|---|
| `text` | `string` | 标签文字 |
| `offsetDistance` | `number` | 标签位置偏移（0-100 百分比） |
| `textColor` | `string` | 文字颜色 |
| `fill` | `string` | 背景颜色 |
| `fontSize` | `number` | 字体大小 |
| `padding` | `number` | 内边距 |
| `paddingHorizon` | `number` | 水平内边距 |
| `paddingVertical` | `number` | 垂直内边距 |
| `onClick` | `(edge, state, dispatch) => void` | 标签单击事件 |
| `onDblClick` | `(edge, state, dispatch) => void` | 标签双击事件 |

## Tools 工具栏

需要自定义配置工具栏内容时使用。`<Tools>` 组件提供多种内置工具，同时支持自定义工具和按需组合。

### Tools Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `appendMenu` | `array` | — | 在默认工具末尾追加新工具 |
| `prependMenu` | `array` | — | 在默认工具前插入新工具 |
| `children` | `ReactNode` | — | 完全覆盖默认工具，自定义工具栏内容 |

### 内置工具组件

可以单独使用，也可以自由组合：

| 组件 | 说明 |
|---|---|
| `<Tools.FullScreen />` | 全屏切换 |
| `<Tools.Scale />` | 缩放适配画布 |
| `<Tools.Marquee />` | 框选模式（Shift + 拖动） |
| `<Tools.Zoom />` | 缩放控制 |
| `<Tools.Delete />` | 删除选中元素 |
| `<Tools.Align />` | 对子节点进行对齐调整 |
| `<Tools.AutoLayout />` | 自动布局 |

### 使用示例

```tsx | pure
import { Diagram, Tools } from '@fiagram/react'

// 使用默认工具栏（包含全部工具）
<Diagram nodes={nodes} edges={edges} shapes={shapes} />

// 按需使用内置工具
<Diagram nodes={nodes} edges={edges} shapes={shapes}>
  <Tools>
    <Tools.Delete />
    <Tools.Zoom />
  </Tools>
</Diagram>

// 隐藏工具栏
<Diagram hideTools nodes={nodes} edges={edges} shapes={shapes} />
```

