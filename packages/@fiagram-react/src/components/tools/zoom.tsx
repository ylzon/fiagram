import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as d3 from 'd3'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'

interface IProps {}

export const Zoom: FC<IProps> = () => {
  const { t } = useTranslation()
  const { state } = useDiagramStore(state => state)
  const { svgInfo } = state
  const percentage = {
    zoomOut: -0.35,
    zoomIn: 0.35,
  }
  const handleZoom = (type: keyof typeof percentage) => {
    if (!svgInfo) return
    const per = percentage[type]

    const currentK = d3.zoomTransform(svgInfo.svg.node()).k
    const rate = currentK * (1 + per)
    svgInfo.svg
      .transition()
      .duration(500)
      .call(svgInfo.zoom.scaleTo, rate)
  }

  return (
    <ToolbarGroup
      group={[
        { key: 'zoomIn', title: t('translation:zoomIn'), icon: 'icon-zoom-in', onClick: () => handleZoom('zoomIn') },
        { key: 'zoomOut', title: t('translation:zoomOut'), icon: 'icon-zoom-out', onClick: () => handleZoom('zoomOut') },
      ]}
    />
  )
}
