import { useEffect, useState } from 'react'
import _ from 'lodash'
import { batchGenerateEdgePath } from '@fiagram/core/src/utils/edge'
import type { Nodes } from '@fiagram/core/types/nodes'
import type { DiagramState } from '@fiagram/core/types/diagram'
import type { Edges } from '@fiagram/core/types/edges'
import type { CanvasProps } from '../components/canvas'
import { useDiagramStore } from './useDiagramStore.ts'

export function useUpdateState(props: CanvasProps) {
  const { nodes = [], edges = [] } = props
  const [hasInitialized, setHasInitialized] = useState(false)
  const { updateNodesAndEdges, setState } = useDiagramStore(state => state)

  useEffect(() => {
    // 除了restChilds，其余属性变化时，更新props 到 store
    const { restChilds, ...restProps } = props
    setState(restProps as DiagramState)
  }, [props])

  useEffect(() => {
    const newNodes: Nodes = _.cloneDeep(nodes || [])
    const newEdges: Edges = batchGenerateEdgePath(newNodes, _.cloneDeep(edges || [])) // 生成线的path路径
    setHasInitialized(true) // 用于判断撤回数据是否记录
    updateNodesAndEdges(newNodes, newEdges, hasInitialized ? 'patch' : 'all')
  }, [nodes, edges])

  return null
}
