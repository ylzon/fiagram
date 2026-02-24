---
title: 快速开始
order: 1
nav:
  title: 文档
  order: 0
---

# 快速开始

Fiagram 是一个基于 SVG + D3.js 的可视化图形库，可快速构建拓扑图、流程图等可视化组件。

## 安装

```bash
# npm
npm install @fiagram/react

# pnpm
pnpm add @fiagram/react
```

## 核心概念

Fiagram 的核心由三个要素构成：

| 概念 | 说明 | 对应 Prop |
|---|---|---|
| **Shapes（图形）** | 定义节点的渲染外观，是一个注册机制。每个 Shape 包含名称、SVG 组件和默认尺寸 | `shapes` |
| **Nodes（节点）** | 画布上的节点实例数据，指定位置、尺寸、使用的 Shape 等信息 | `nodes` |
| **Edges（连线）** | 节点间的连线，指定源/目标节点、连接方向和连线类型 | `edges` |

## 最小示例

```tsx
/**
 * title: 基础用法
 * description: 创建三个节点并用折线连接
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
| 折线 | `broken` | 正交折线，仅水平/垂直线段 |
| 圆角折线 | `broken-rounded` | 正交折线 + 圆角转折 |

## 连接方向

连线的 `sourceDirection` 和 `targetDirection` 支持 4 个方向：

`top` | `bottom` | `left` | `right`

## 下一步

- 查看 [API 参考](/api) 了解完整的配置项
- 查看 [演示](/example) 探索更多用法
