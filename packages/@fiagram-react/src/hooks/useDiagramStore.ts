import { create } from 'zustand'
import { produce } from 'immer'
import type { DiagramState } from '../types/diagram'
import type { Nodes } from '../types/nodes'
import { uuid } from '../utils/uuid.ts'
import type { Size } from './ahooks/useSize.tsx'

interface IProps {
  state: DiagramState
  setState: (state: DiagramState) => void
  setNodes: (nodes: Nodes) => void
  setSvgInfo: (svgInfo: Element) => void
  setCanvasSize: (size: Size) => void
}

export const useDiagramStore = create<IProps>(set => ({
  state: {
    width: 0,
    height: 0,
    nodes: [],
    edges: [],
    history: [],
    svgInfo: null,
    selectedNodes: [],
    selectedEdges: [],
    marqueeNodes: [],
    copyNode: null,
    targetInfo: null,
    gaussianBlur: 26,
    centroidTick: 0,
    uniqId: uuid(),
  },
  setState: (props) => {
    set(state => ({
      state: {
        ...state,
        ...props,
      },
    }))
  },
  setNodes: (nodes) => {
    set(produce(({ state }) => {
      state.nodes = nodes
    }))
  },
  setSvgInfo: (svgInfo) => {
    set(produce(({ state }) => {
      state.svgInfo = svgInfo
    }))
  },
  setCanvasSize: (size) => {
    set(produce(({ state }) => {
      state.width = size.width
      state.height = size.height
    }))
  },
}))
