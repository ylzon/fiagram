import React, { useState } from 'react'
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

const App = () => {
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5))
  }

  return (
    <div>
      <Diagram
        canvasStyle={{ height: 300 }}
        shapes={[
          {
            shape: 'capsule',
            label: 'capsule',
            nodeInfo: { width: 100, height: 40 },
            component: (node: any) => <NodeShape {...node} />,
          },
        ]}
        nodes={[
          { id: '1', x: 150, y: 120, shape: 'capsule', width: 100, height: 40, label: 'Node A' },
          { id: '2', x: 350, y: 120, shape: 'capsule', width: 100, height: 40, label: 'Node B' },
        ]}
        edges={[
          { id: 'e1', type: 'broken-rounded', source: '1', sourceDirection: 'right', target: '2', targetDirection: 'left', label: 'Edge 1' },
        ]}
        nodeProps={{
          onClick: (node: any) => addLog(`单击节点: ${node.label} (id: ${node.id})`),
          onDblClick: (node: any) => addLog(`双击节点: ${node.label} (id: ${node.id})`),
        }}
        edgeProps={{
          onClick: (edge: any) => addLog(`单击连线: ${edge.label || edge.id}`),
          onDblClick: (edge: any) => addLog(`双击连线: ${edge.label || edge.id}`),
        }}
        hideTools
        hideDragBox
      />
      <div style={{
        margin: '0 8px',
        padding: '12px 16px',
        background: '#1a1a2e',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#a0e4b0',
        minHeight: '80px',
      }}>
        <div style={{ color: '#888', marginBottom: '4px' }}>📋 事件日志（单击/双击节点或连线）</div>
        {log.length === 0
          ? <div style={{ color: '#555' }}>暂无事件...</div>
          : log.map((item, i) => <div key={i} style={{ opacity: 1 - i * 0.15 }}>{item}</div>)
        }
      </div>
    </div>
  )
}

export default App
