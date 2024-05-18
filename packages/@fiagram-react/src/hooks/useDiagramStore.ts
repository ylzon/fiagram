import { create } from 'zustand'
import { produce } from 'immer'
import _ from 'lodash'
import { generateEdgePath } from '@fiagram/core/src/utils/edge'
import type { DiagramState, SvgInfo } from '@fiagram/core/types/diagram'
import type { Nodes } from '@fiagram/core/types/nodes'
import type { Edge, Edges } from '@fiagram/core/types/edges'
import { uuid } from '../utils/uuid.ts'
import type { Size } from './ahooks/useSize.tsx'

export interface DiagramActions {
  state: DiagramState
  setState: (state: DiagramState) => void
  setNodes: (nodes: Nodes) => void
  setEdges: (edges: Edges) => void
  insertEdge: (edge: Edge) => void
  setSvgInfo: (svgInfo: SvgInfo) => void
  setCanvasSize: (size?: Size) => void
  setSelectedNodes: (nodes: Nodes) => void
  updateNodesAndEdges: (nodes: Nodes, edges: Edges, type: 'all' | 'patch') => void
}

export const useDiagramStore = create<DiagramActions>(set => ({
  state: {
    width: 0,
    height: 0,
    nodes: [],
    edges: [],
    backupData: [],
    svgInfo: {},
    selectedNodes: [],
    selectedEdges: [],
    marqueeNodes: [],
    copyNode: null,
    targetInfo: null,
    gaussianBlur: 26,
    centroidTick: 0,
    uniqId: uuid(),
    edgeProps: {},
  },
  setState: (params) => {
    set(state => ({
      state: {
        ...state,
        ...params,
      },
    }))
  },
  setNodes: (nodes) => {
    set(produce(({ state }) => {
      state.nodes = nodes
    }))
  },
  setEdges: (edges) => {
    set(produce(({ state }) => {
      state.edges = edges
    }))
  },
  insertEdge: (edge) => {
    set(produce(({ state }) => {
      const newEdges = generateEdgePath(state.nodes, edge)
      state.edges = state.edges.concat(newEdges)
    }))
  },
  setSvgInfo: (svgInfo) => {
    set(produce(({ state }) => {
      state.svgInfo = svgInfo
    }))
  },
  setCanvasSize: (size) => {
    set(produce(({ state }) => {
      state.width = size?.width || 0
      state.height = size?.height || 0
    }))
  },
  setSelectedNodes: (nodes) => {
    set(produce(({ state }) => {
      state.selectedNodes = nodes
    }))
  },
  updateNodesAndEdges: (nodes, edges, type = 'patch') => {
    set(produce(({ state }) => {
      if (type === 'patch') {
        state.backupData = state.backupData?.concat({
          nodes: _.cloneDeep(state.nodes),
          edges: _.cloneDeep(state.edges),
        })
      }
      state.nodes = nodes
      state.edges = edges
    }))
  },
}))
