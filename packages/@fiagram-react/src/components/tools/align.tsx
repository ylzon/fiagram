import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ALIGN_DIRECT } from '@fiagram/core/src/constant'
import _ from 'lodash'
import { checkNodesByMovingNode } from '@fiagram/core/src/utils/diagram'
import { moveNodesAligned } from '@fiagram/core/src/utils/align'
import type { Direction } from '@fiagram/core/types/tools'
import { ToolbarGroup } from '../toolbar/group'
import type { ToolBarItemProps } from '../toolbar/Item'
import { useDiagramStore } from '../../hooks/useDiagramStore'

interface IProps {}

export const Align: FC<IProps> = () => {
  const { t } = useTranslation()
  const { getState, updateNodes } = useDiagramStore(state => state)

  const handleAlign = (direction: Direction) => {
    const { nodes = [], selectedNodes = [], marqueeNodes = [] } = getState()
    const willMoveNodes = selectedNodes?.concat(marqueeNodes) || []

    if (!_.isEmpty(willMoveNodes)) {
      // 移动节点对齐
      const alignNodes = moveNodesAligned(willMoveNodes, direction, nodes)
      // 判断移动各节点后父层位置是否调整
      const newNodes = _.reduce(
        alignNodes,
        (newNodes, alignNode) => {
          return checkNodesByMovingNode({
            nodes: newNodes,
            node: { ...alignNode, relativeX: alignNode.x, relativeY: alignNode.y },
          })
        },
        [...nodes],
      )
      updateNodes(newNodes)
    }
  }

  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title: t('translation:topAlign'), icon: 'icon-top-aligned', onClick: () => handleAlign(ALIGN_DIRECT.TOP) },
    { key: '2', title: t('translation:bottomAlign'), icon: 'icon-bottom-aligned', onClick: () => handleAlign(ALIGN_DIRECT.BOTTOM) },
    { key: '3', title: t('translation:leftAlign'), icon: 'icon-left-aligned', onClick: () => handleAlign(ALIGN_DIRECT.LEFT) },
    { key: '4', title: t('translation:rightAlign'), icon: 'icon-right-aligned', onClick: () => handleAlign(ALIGN_DIRECT.RIGHT) },
    { key: '5', title: t('translation:verticalAlign'), icon: 'icon-vertical-aligned', onClick: () => handleAlign(ALIGN_DIRECT.VERTICAL) },
    { key: '6', title: t('translation:horizonAlign'), icon: 'icon-horizontal-aligned', onClick: () => handleAlign(ALIGN_DIRECT.HORIZON) },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
