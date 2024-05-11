import React, { type FC } from 'react'
import { Diagram } from '../src'
import type { Node } from '../src/types/nodes'

function NodeShape({ width, height, label }: Node) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect width={width} height={height} rx={height / 2} fill="#3A3D87" />
      <text x="50%" y="51%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="600">
        {label}
      </text>
    </svg>
  )
}

const App: FC = () => {
  return (
    <Diagram
      canvasStyle={{ height: '95vh' }}
      shapes={[
        {
          shape: 'node1',
          label: 'node1',
          nodeInfo: { width: 50, height: 50 },
          component: node => <NodeShape {...node} />,
        },
      ]}
      nodes={[
        { id: '1', x: 100, y: 150, shape: 'node1', width: 50, height: 50, label: 'Node 1' },
        { id: '2', x: 200, y: 250, shape: 'node1', width: 50, height: 50, label: 'Node 2' },
        { id: '3', x: 300, y: 350, shape: 'node1', width: 50, height: 50, label: 'Node 3' },
      ]}
      edges={[
        { id: '1', type: 'broken-rounded', source: '1', sourceDirection: 'bottom', target: '2', targetDirection: 'top', label: 'Link 1' },
        { id: '2', type: 'broken-rounded', source: '2', sourceDirection: 'bottom', target: '3', targetDirection: 'top', label: 'Link 2' },
      ]}
    />
  )
}

export default App
