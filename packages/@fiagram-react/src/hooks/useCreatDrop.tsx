import { useDrop } from 'react-dnd'
import { DRAG_DROP_KEY } from '@fiagram/core/src/constant'
import type { RefObject } from 'react'
import { handleDropNode } from '../utils/drag-drop.ts'
import { useDiagramStore } from './useDiagramStore.ts'

export function useCreatDrop(svgRef: RefObject<SVGSVGElement>) {
  const { state, setNodes } = useDiagramStore(state => state)
  const { nodes = [], svgInfo, uniqId } = state
  const [, drop] = useDrop({
    accept: `${DRAG_DROP_KEY}-${uniqId}`,
    drop: (item, monitor) => {
      const { newNodes } = handleDropNode({ item, monitor, svgRef, svgInfo, nodes })
      setNodes(newNodes)
    },
  })
  drop(svgRef)
  return null
}
