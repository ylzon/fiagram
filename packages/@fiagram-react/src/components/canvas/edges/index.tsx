import React from 'react'
import type { Edges as EdgesType } from '../../../types/edges'
import { EdgeItem } from './edge.tsx'

interface IProps {
  data: EdgesType
}

export const Edges = React.memo<IProps>(({ data }) => {
  const edges: EdgesType = data.filter(edge => edge.pathD)
  return (
    <g className="edges-container">
      {edges.map(edge => <EdgeItem key={edge?.id} data={edge} />)}
    </g>
  )
})
