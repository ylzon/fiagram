import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { zoomCentroid } from '../../utils/animation.ts'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'

interface IProps {}

export const Scale: FC<IProps> = () => {
  const { t } = useTranslation()
  const { state } = useDiagramStore(state => state)
  const handleCanvasCenter = () => {
    if (!state.svgInfo) return
    zoomCentroid(state.svgInfo, 1000)
  }
  const handleCanvasAdaptive = () => {
    if (!state.svgInfo) return
    zoomCentroid(state.svgInfo, 1000, 1)
  }

  return (
    <ToolbarGroup
      group={[
        { key: '1', title: t('translation:center'), icon: 'icon-center', onClick: handleCanvasCenter },
        { key: '2', title: '1:1', icon: 'icon-adaptive', onClick: handleCanvasAdaptive },
      ]}
    />
  )
}
