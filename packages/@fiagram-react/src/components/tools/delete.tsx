import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { KEY_CODES } from '@fiagram/core/src/constant'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'
import { closeMarquee } from './marquee.tsx'

interface IProps {}

export const Delete: FC<IProps> = () => {
  const { t } = useTranslation()
  const {
    state,
    getState,
    deleteNodeByIds,
    deleteEdgeByIds,
    setSelectedNodes,
    setMarqueeNodes,
    setSelectedEdges,
  } = useDiagramStore(state => state)
  const title = t('translation:delete')
  const {
    svgInfo,
    selectedEdges = [],
    selectedNodes = [],
    marqueeNodes = [],
  } = state
  const disabled = !selectedEdges?.length && !selectedNodes?.length && !marqueeNodes?.length

  const handleDelete = () => {
    const { selectedEdges = [], selectedNodes = [], marqueeNodes = [] } = getState()
    if (!svgInfo) return
    const willDeleteNodeIds = selectedNodes.concat(marqueeNodes).map(node => node?.id || '')
    const willDeleteEdgeIds = selectedEdges.map(edge => edge?.id || '')
    if (!willDeleteNodeIds.length && !willDeleteEdgeIds.length) return
    if (willDeleteNodeIds.length) {
      deleteNodeByIds(willDeleteNodeIds)
      if (marqueeNodes.length) {
        closeMarquee(svgInfo)
        setMarqueeNodes([])
      }
      if (selectedNodes.length) {
        setSelectedNodes([])
      }
    }
    if (willDeleteEdgeIds.length) {
      deleteEdgeByIds(willDeleteEdgeIds)
      setSelectedEdges([])
    }
  }

  return (
    <ToolbarGroup
      group={[
        {
          key: 'delete',
          title: disabled ? `${title}(${t('translation:pleaseSelectAtLeastOneNode')})` : title,
          icon: 'icon-delete',
          keyCodes: [
            KEY_CODES.Delete,
            KEY_CODES.Backspace,
          ],
          onClick: handleDelete,
          onKeyDown: handleDelete,
          disabled,
        },
      ]}
    />
  )
}
