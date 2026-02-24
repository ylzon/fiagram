import React from 'react'
import { Diagram } from '@fiagram/react'

function NodeShape({ width, height, label }: any) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect width={width} height={height} rx="8" fill="#3A3D87" />
      <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="600">
        {label}
      </text>
    </svg>
  )
}

const shapes = [
  {
    shape: 'box',
    label: 'box',
    nodeInfo: { width: 80, height: 40 },
    component: (node: any) => <NodeShape {...node} />,
  },
]

const nodes = [
  // Row 1: straight
  { id: 's1', x: 80, y: 40, shape: 'box', width: 80, height: 40, label: 'straight' },
  { id: 's2', x: 300, y: 40, shape: 'box', width: 80, height: 40, label: 'straight' },
  // Row 2: curve-auto
  { id: 'c1', x: 80, y: 130, shape: 'box', width: 80, height: 40, label: 'curve' },
  { id: 'c2', x: 300, y: 130, shape: 'box', width: 80, height: 40, label: 'curve' },
  // Row 3: broken
  { id: 'b1', x: 80, y: 220, shape: 'box', width: 80, height: 40, label: 'broken' },
  { id: 'b2', x: 300, y: 220, shape: 'box', width: 80, height: 40, label: 'broken' },
  // Row 4: broken-rounded
  { id: 'r1', x: 80, y: 310, shape: 'box', width: 80, height: 40, label: 'rounded' },
  { id: 'r2', x: 300, y: 310, shape: 'box', width: 80, height: 40, label: 'rounded' },
]

const edges = [
  { id: 'e1', type: 'straight', source: 's1', sourceDirection: 'right', target: 's2', targetDirection: 'left', label: 'straight' },
  { id: 'e2', type: 'curve-auto', source: 'c1', sourceDirection: 'right', target: 'c2', targetDirection: 'left', label: 'curve-auto' },
  { id: 'e3', type: 'broken', source: 'b1', sourceDirection: 'bottom', target: 'b2', targetDirection: 'top', label: 'broken' },
  { id: 'e4', type: 'broken-rounded', source: 'r1', sourceDirection: 'bottom', target: 'r2', targetDirection: 'top', label: 'broken-rounded' },
]

const App = () => {
  return (
    <Diagram
      canvasStyle={{ height: 450 }}
      shapes={shapes}
      nodes={nodes}
      edges={edges}
      hideTools
      hideDragBox
    />
  )
}

export default App
