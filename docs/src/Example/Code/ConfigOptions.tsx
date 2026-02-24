import React from 'react'
import { Diagram } from '@fiagram/react'

function NodeShape({ width, height, label }: any) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect width={width} height={height} rx={height / 2} fill="#3A3D87" />
      <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="600">
        {label}
      </text>
    </svg>
  )
}

const shapes = [
  {
    shape: 'capsule',
    label: 'capsule',
    nodeInfo: { width: 100, height: 40 },
    component: (node: any) => <NodeShape {...node} />,
  },
]

const nodes = [
  { id: '1', x: 150, y: 120, shape: 'capsule', width: 100, height: 40, label: 'Node 1' },
  { id: '2', x: 350, y: 120, shape: 'capsule', width: 100, height: 40, label: 'Node 2' },
]

const edges = [
  { id: 'e1', type: 'broken-rounded', source: '1', sourceDirection: 'right', target: '2', targetDirection: 'left', label: 'Link' },
]

const App = () => {
  return (
    <Diagram
      canvasStyle={{ height: 300 }}
      shapes={shapes}
      nodes={nodes}
      edges={edges}
      hideGrid
      hideTools
      hideDragBox
      nodeProps={{
        resizeDisabled: true,
        connectDisabled: true,
        rotateDisabled: true,
      }}
    />
  )
}

export default App
