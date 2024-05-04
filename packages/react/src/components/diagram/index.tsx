import React from 'react'
import { Canvas } from '../canvas'
import type { DiagramProps } from '../../types/diagram'

export const Diagram: React.FC<DiagramProps> = (props) => {
  return (
    <div className="bg-amber-100">
      <Canvas {...props}></Canvas>
    </div>
  )
}
