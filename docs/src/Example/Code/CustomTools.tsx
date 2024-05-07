import React, { type FC } from 'react'
import { Diagram, Tools } from '@fiagram/react'

const { Align, FullScreen } = Tools

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

const App: FC = () => {
  return (
    <Diagram
      canvasStyle={{ height: 400 }}
      shapes={[
        {
          shape: 'node1',
          label: 'node1',
          nodeInfo: { width: 50, height: 50 },
          component: node => <NodeShape {...node} />,
        },
      ]}
      nodes={[
        { id: '1', x: 150, y: 150, shape: 'node1', width: 50, height: 50, label: 'Node 1' },
        { id: '2', x: 300, y: 150, shape: 'node1', width: 50, height: 50, label: 'Node 2' },
        { id: '3', x: 450, y: 150, shape: 'node1', width: 50, height: 50, label: 'Node 3' },
      ]}
      edges={[
        { id: '1', type: 'brokenRounded', source: '1', sourceDirection: 'bottom', target: '2', targetDirection: 'top', label: 'Link 1' },
        { id: '2', type: 'brokenRounded', source: '2', sourceDirection: 'bottom', target: '3', targetDirection: 'top', label: 'Link 2' },
      ]}
    >
      <Tools>
        <Align />
        <FullScreen />
      </Tools>
    </Diagram>
  )
}

export default App
