import React, { type FC } from 'react'
import type { Node } from '@fiagram/core/types/nodes'
import { Diagram } from '../src'

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
      edgeProps={{
        defaultNewEdgeStyle: {
          type: 'broken-rounded',
        },
      }}
      nodes={[
        { id: 'node1', x: 100, y: 150, shape: 'node1', width: 50, height: 50, label: 'Node 1' },
        { id: 'node2', x: 200, y: 250, shape: 'node1', width: 50, height: 50, label: 'Node 2' },
        { id: 'node3', x: 300, y: 350, shape: 'node1', width: 50, height: 50, label: 'Node 3' },
        { id: 'node4', x: 500, y: 450, shape: 'node1', width: 50, height: 50, label: 'Node 4' },
        // { id: 'node5', x: 400, y: 250, shape: 'node1', width: 50, height: 50, label: 'Node 5' },
      ]}
      edges={[
        { id: 'link1', type: 'broken', source: 'node1', sourceDirection: 'bottom', target: 'node2', targetDirection: 'top', label: 'Link 1' },
        { id: 'link2', type: 'broken-rounded', source: 'node2', sourceDirection: 'bottom', target: 'node3', targetDirection: 'top', label: 'Link 2' },
        { id: 'link3', type: 'curve-auto', source: 'node3', sourceDirection: 'bottom', target: 'node4', targetDirection: 'top', label: 'Link 3' },
        // { id: 'link4', type: 'curve-auto', source: 'node3', sourceDirection: 'right', target: 'node5', targetDirection: 'left', label: 'Link 3' },
      ]}
    />
  )
}

export default App
