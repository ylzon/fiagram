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
  const { state, getState, updateNodes } = useDiagramStore(state => state)
  const { selectedNodes = [], marqueeNodes = [] } = state
  const totalSelected = selectedNodes?.length + marqueeNodes?.length
  const disabled = totalSelected < 2

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

  const toolsGroup = [
    { key: 'TOP', title: t('translation:topAlign'), icon: 'icon-top-aligned' },
    { key: 'BOTTOM', title: t('translation:bottomAlign'), icon: 'icon-bottom-aligned' },
    { key: 'LEFT', title: t('translation:leftAlign'), icon: 'icon-left-aligned' },
    { key: 'RIGHT', title: t('translation:rightAlign'), icon: 'icon-right-aligned' },
    { key: 'VERTICAL', title: t('translation:verticalAlign'), icon: 'icon-vertical-aligned' },
    { key: 'HORIZON', title: t('translation:horizonAlign'), icon: 'icon-horizontal-aligned' },
  ].map(v => ({
    ...v,
    disabled,
    title: disabled ? `${v.title}(${t('translation:pleaseSelectAtLeastTwoNodes')})` : v.title,
    onClick: () => handleAlign(ALIGN_DIRECT[v.key as keyof typeof ALIGN_DIRECT]),
  })) as ToolBarItemProps[]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
