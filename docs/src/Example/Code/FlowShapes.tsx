import React from 'react'
import { Diagram } from '@fiagram/react'

function TextCenter({ color, y, label }: { color?: string, y?: string, label?: string }) {
  return (
    <text
      x="50%"
      y={y || '51%'}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={color || 'white'}
      fontSize="13"
      fontWeight="600"
    >
      {label}
    </text>
  )
}

const shapes = [
  {
    shape: 'flow-start',
    label: 'Start',
    nodeInfo: { id: 'i', x: 0, y: 0, width: 130, height: 35, shape: 'flow-start' },
    component: ({ width, height, label }: any) => (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect width={width} height={height} rx={height / 2} fill="#3A3D87" />
        <TextCenter label={label} />
      </svg>
    ),
  },
  {
    shape: 'flow-process',
    label: 'Process',
    nodeInfo: { id: 'i', x: 0, y: 0, width: 130, height: 35, shape: 'flow-process' },
    component: ({ width, height, label }: any) => (
      <svg width={width + 2} height={height + 3} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" fill="#DB9730" fillOpacity="0.2" />
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" stroke="#DB9730" strokeWidth="2" />
        <TextCenter label={label} color="#DB9730" />
      </svg>
    ),
  },
  {
    shape: 'flow-exegesis',
    label: 'Exegesis',
    nodeInfo: { id: 'i', x: 0, y: 0, width: 130, height: 35, shape: 'flow-exegesis' },
    component: ({ width, height, label }: any) => (
      <svg width={width + 2} height={height + 3} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" fill="#30C687" fillOpacity="0.2" />
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" stroke="#30C687" strokeWidth="2" strokeDasharray="8 2" />
        <TextCenter label={label} color="#30C687" />
      </svg>
    ),
  },
  {
    shape: 'flow-end',
    label: 'End',
    nodeInfo: { id: 'i', x: 0, y: 0, width: 130, height: 35, shape: 'flow-end' },
    component: ({ width, height, label }: any) => (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect width={width} height={height} rx={height / 2} fill="#1CB273" />
        <TextCenter label={label} />
      </svg>
    ),
  },
]

const nodes = [
  { id: '1', x: 60, y: 50, shape: 'flow-start', width: 130, height: 35, label: 'Start' },
  { id: '2', x: 260, y: 50, shape: 'flow-process', width: 130, height: 35, label: 'Process' },
  { id: '3', x: 460, y: 50, shape: 'flow-process', width: 130, height: 35, label: 'Validate' },
  { id: '4', x: 60, y: 180, shape: 'flow-exegesis', width: 130, height: 35, label: 'Exegesis' },
  { id: '5', x: 260, y: 180, shape: 'flow-process', width: 130, height: 35, label: 'Execute' },
  { id: '6', x: 460, y: 180, shape: 'flow-end', width: 130, height: 35, label: 'End' },
]

const edges = [
  { id: 'e1', type: 'broken-rounded', source: '1', sourceDirection: 'right', target: '2', targetDirection: 'left' },
  { id: 'e2', type: 'broken-rounded', source: '2', sourceDirection: 'right', target: '3', targetDirection: 'left' },
  { id: 'e3', type: 'broken-rounded', source: '3', sourceDirection: 'bottom', target: '6', targetDirection: 'top' },
  { id: 'e4', type: 'broken-rounded', source: '1', sourceDirection: 'bottom', target: '4', targetDirection: 'top' },
  { id: 'e5', type: 'broken-rounded', source: '4', sourceDirection: 'right', target: '5', targetDirection: 'left' },
  { id: 'e6', type: 'broken-rounded', source: '5', sourceDirection: 'right', target: '6', targetDirection: 'left' },
]

function App() {
  return (
    <Diagram
      canvasStyle={{ height: 350 }}
      shapes={shapes}
      nodes={nodes}
      edges={edges}
      hideDragBox
    />
  )
}

export default App
