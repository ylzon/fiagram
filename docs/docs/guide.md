---
title: 快速开始
order: 1
nav:
  title: 文档
  order: 0
---

# 快速开始

Fiagram 是一个基于 SVG + D3.js 的图形可视化库，帮助开发者快速构建拓扑图、流程图等交互式可视化组件。支持节点拖拽、连线编辑、缩放平移、框选对齐等丰富的交互能力。

## 安装

```bash
# npm
npm install @fiagram/react

# pnpm
pnpm add @fiagram/react
```

## 核心概念

Fiagram 的核心围绕三个数据模型展开：

| 概念 | 说明 | 对应 Prop |
|---|---|---|
| **Shapes（图形模板）** | 注册自定义的节点外观。每个 Shape 包含唯一标识、渲染组件和默认尺寸，是节点的"模板" | `shapes` |
| **Nodes（节点数据）** | 画布上的节点实例。每个节点引用一个 Shape，并指定位置、尺寸和标签等信息 | `nodes` |
| **Edges（连线数据）** | 描述节点间的连线关系。指定源/目标节点、锚点方向和连线类型 | `edges` |

> 💡 **提示**：建议先定义好 Shape 模板，再基于 Shape 创建 Node 实例，最后通过 Edge 建立节点间的连线关系。

## 基础用法

Diagram 组件的父容器建议设置明确的宽高，以获得最佳的展示效果。

```tsx
/**
 * title: 基础用法
 * description: 创建三个节点并用圆角折线连接，可拖拽节点、滚轮缩放画布
 */
import React from 'react'
import { Diagram } from '@fiagram/react'

function NodeShape({ width, height, label }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect width={width} height={height} rx={height / 2} fill="#3A3D87" />
      <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="600">
        {label}
      </text>
    </svg>
  )
}

export default () => (
  <Diagram
    canvasStyle={{ height: 300 }}
    shapes={[
      {
        shape: 'capsule',
        label: 'capsule',
        nodeInfo: { width: 100, height: 40 },
        component: node => <NodeShape {...node} />,
      },
    ]}
    nodes={[
      { id: '1', x: 100, y: 100, shape: 'capsule', width: 100, height: 40, label: '开始' },
      { id: '2', x: 300, y: 100, shape: 'capsule', width: 100, height: 40, label: '处理' },
      { id: '3', x: 500, y: 100, shape: 'capsule', width: 100, height: 40, label: '结束' },
    ]}
    edges={[
      { id: 'e1', type: 'broken-rounded', source: '1', sourceDirection: 'right', target: '2', targetDirection: 'left', label: '步骤 1' },
      { id: 'e2', type: 'broken-rounded', source: '2', sourceDirection: 'right', target: '3', targetDirection: 'left', label: '步骤 2' },
    ]}
  />
)
```

## 连线类型

Fiagram 支持 4 种连线类型，通过 Edge 的 `type` 字段指定：

| 类型 | 值 | 说明 |
|---|---|---|
| 直线 | `straight` | 起点到终点的直线连接 |
| 自动曲线 | `curve-auto` | 自动计算控制点的贝塞尔曲线 |
| 折线 | `broken` | 正交折线，仅包含水平和垂直线段 |
| 圆角折线 | `broken-rounded` | 在正交折线基础上增加圆角转折效果 |

## 连接方向

连线的 `sourceDirection` 和 `targetDirection` 用于指定节点的连接锚点位置，支持 4 个方向：

| 方向 | 值 | 说明 |
|---|---|---|
| 上 | `top` | 节点顶部中心 |
| 下 | `bottom` | 节点底部中心 |
| 左 | `left` | 节点左侧中心 |
| 右 | `right` | 节点右侧中心 |

## 高级模式

通过设置 `mode="advance"` 可启用高级交互模式，包含以下增强功能：

| 功能 | 说明 |
|---|---|
| 自由锚点建线 | 可从节点边沿任意位置拖出锚点建立连线，不再局限于四方位锚点 |
| 标签位置拖拽 | 连线标签可沿连线路径拖动至任意位置 |
| 锚点位置调整 | Hover 到连线上时，可拖动连线两端锚点重新调整连接位置 |

```tsx | pure
// 启用高级模式
<Diagram
  mode="advance"
  nodes={nodes}
  edges={edges}
/>
```

## 行为控制

Fiagram 提供了丰富的开关属性，用于精细控制组件的交互行为：

| 属性 | 说明 |
|---|---|
| `hideTools` | 隐藏顶部工具栏 |
| `hideDragBox` | 隐藏左侧图形拖拽面板 |
| `hideGrid` | 隐藏背景网格 |
| `wheelZoomDisabled` | 禁止鼠标滚轮缩放画布 |
| `dragZoomDisabled` | 禁止鼠标拖拽平移画布 |
| `copyNodeDisabled` | 禁止 Ctrl+C/V 复制粘贴节点 |

节点级行为控制（通过 `nodeProps` 统一配置）：

| 属性 | 说明 |
|---|---|
| `connectDisabled` | 禁止节点间建立连线 |
| `resizeDisabled` | 禁止调整节点大小 |
| `dragDisabled` | 禁止拖动节点 |
| `rotateDisabled` | 禁止旋转节点 |

## 下一步

- 查看 [API 参考](/api) 了解完整的属性配置
- 查看 [演示](/example) 探索更多交互用法
