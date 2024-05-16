import { useEffect, useState } from 'react'
import _ from 'lodash'
import { calcEdgePath, reCalcMultStraightLineBtwNodes } from '@fiagram/core/src/utils/edge'
import type { Nodes } from '@fiagram/core/types/nodes'
import type { Edges } from '@fiagram/core/types/edges'
import type { CanvasProps } from '../components/canvas'
import { useDiagramStore } from './useDiagramStore.ts'

export function useUpdateState(props: CanvasProps) {
  const { nodes = [], edges = [] } = props
  const [hasInitialized, setHasInitialized] = useState(false) // 用于判断撤回数据是否记录
  const { state, updateNodesAndEdges } = useDiagramStore(state => state)
  useEffect(() => {
    // 给线绑定两端的节点数据
    if (nodes !== undefined || edges !== undefined) {
      const newNodes: Nodes = [...nodes]
      let newEdges: Edges = [...edges]
      const { nodes: prevNodes, edges: prevEdges } = state
      const purePrevEdges = _.map([...prevEdges], (edge) => {
        return _.omit(edge, ['pathD', 'centerX', 'centerY'])
      })
      const isNodesChanged = !_.isEqual(nodes, prevNodes)
      const isEdgesChanged = !_.isEqual(edges, purePrevEdges)
      if (isNodesChanged || isEdgesChanged) {
        if (!_.isEmpty(nodes)) {
          newEdges = _.map(edges, edge => calcEdgePath(newNodes, edge))
          reCalcMultStraightLineBtwNodes(newEdges, nodes)
          setHasInitialized(true)
          updateNodesAndEdges(newNodes, newEdges, hasInitialized ? 'patch' : 'all')

          // 当首次发现nodes数据不为空时触发居中 (* 延迟自动居中，因数据未渲染完成导致居中参数读取错误）
          // setTimeout(() => {
          //   !withoutCentriod && store.dispatch({ type: 'TRIGGER_ZOOM_CENTROID' })
          // }, 10)
        } else {
          updateNodesAndEdges(newNodes, newEdges, 'patch')
        }
      }
    }
  }, [nodes, edges])

  return null
}
