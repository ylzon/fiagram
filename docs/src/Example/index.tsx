import React, { type FC } from 'react'

import { Diagram } from '@fiagram/react';

const NodeShape: FC = ({ x, y, width, height, name }: any) => {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="white" stroke="black" />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" alignmentBaseline="middle">{name}</text>
    </g>
  )
}

const App: FC = () => {
  return (
    <div
      shapes={[
        { name: 'node1', shape: NodeShape },
      ]}
      nodes={[
        { id: '1', x: 100, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 1' },
        { id: '2', x: 300, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 2' },
        { id: '3', x: 500, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 3' },
      ]}
      links={[
        { id: '1', type: 'BROKEN_ROUNDED', source: '1', sourceDirection: 'BOTTOM', target: '2', targetDirection: 'TOP', name: 'Link 1' },
        { id: '2', type: 'BROKEN_ROUNDED', source: '2', sourceDirection: 'BOTTOM', target: '3', targetDirection: 'TOP', name: 'Link 2' },
      ]}
    />
  )
}

export default App
