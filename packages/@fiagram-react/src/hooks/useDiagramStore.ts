import { create } from 'zustand'
import { produce } from 'immer'
import _ from 'lodash'
import { batchGenerateEdgePath, generateEdgePath } from '@fiagram/core/src/utils/edge'
import type { DiagramState, SvgInfo } from '@fiagram/core/types/diagram'
import type { Node, Nodes, Rect } from '@fiagram/core/types/nodes'
import type { Edge, Edges } from '@fiagram/core/types/edges'
import { findAndUpdateNode, findChainOfNode, minimizeRect } from '@fiagram/core/src/utils/diagram.ts'
import { uuid } from '../utils/uuid.ts'
import type { Size } from './ahooks/useSize.tsx'

export interface DiagramActions {
  state: DiagramState
  setState: (state: DiagramState) => void
  getState: () => DiagramState
  setNodes: (nodes: Nodes) => void
  setEdges: (edges: Edges) => void
  insertEdge: (edge: Edge) => void
  deleteNodeByIds: (ids: string[]) => void
  deleteEdgeByIds: (ids: string[]) => void
  setSvgInfo: (svgInfo: SvgInfo) => void
  setCanvasSize: (size?: Size) => void
  setSelectedNodes: (nodes: Nodes) => void
  setMarqueeNodes: (nodes: Nodes) => void
  setSelectedEdges: (edges: Edges) => void
  updateEdge: (edge: Edge | Edges) => void
  resizeNode: (node: Node | undefined, rect: Rect) => void
  updateNodesAndEdges: (nodes: Nodes, edges: Edges, type: 'all' | 'patch') => void
  updateNodes: (nodes: Nodes) => void
}

export const useDiagramStore = create<DiagramActions>((set, get) => ({
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
    nodeProps: {},
  },
  setState: (newState) => {
    set(state => ({
      state: {
        ...state,
        ...newState,
      },
    }))
  },
  getState: () => {
    return get().state
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
  deleteNodeByIds: (ids) => {
    set(produce(({ state }) => {
      state.nodes = _.filter(state.nodes, node => !_.includes(ids, node.id))
      state.edges = _.filter(state.edges, edge => !_.includes(ids, edge.source) && !_.includes(ids, edge.target))
    }))
  },
  deleteEdgeByIds: (ids) => {
    set(produce(({ state }) => {
      state.edges = _.filter(state.edges, edge => !_.includes(ids, edge.id))
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
  setMarqueeNodes: (nodes) => {
    set(produce(({ state }) => {
      state.marqueeNodes = nodes
    }))
  },
  setSelectedEdges: (edges) => {
    set(produce(({ state }) => {
      state.selectedEdges = edges
    }))
  },
  // ============================ Node & Edge Effect ============================
  updateEdge: (edge) => {
    let updateEdges = Array.isArray(edge) ? edge : [edge]
    set(produce(({ state }) => {
      updateEdges = _.map(updateEdges, (updateEdge) => {
        if (!updateEdge.pathD) {
          updateEdge = generateEdgePath(state.nodes, updateEdge)
        }
        return updateEdge
      })
      state.edges = _.map(state.edges, (edge) => {
        const idx = _.findIndex(updateEdges, updateEdge => updateEdge.id === edge.id)
        return idx > -1 ? updateEdges[idx] : edge
      })
    }))
  },
  resizeNode: (node, rect) => {
    set(produce(({ state }) => {
      const { nodes, edges } = state
      const chain = findChainOfNode(nodes, node?.id)
      const currentNode = chain[chain.length - 1]
      rect = minimizeRect(rect, currentNode)
      const newNodes = findAndUpdateNode(nodes, node?.id, rect)
      const newEdges = batchGenerateEdgePath(newNodes, edges)
      state.nodes = newNodes
      state.edges = newEdges
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
  updateNodes: (newNodes) => {
    set(produce(({ state }) => {
      const newEdges = _.map(state.edges, edge => generateEdgePath(newNodes, edge))
      state.nodes = newNodes
      state.edges = newEdges
    }))
  },
}))
