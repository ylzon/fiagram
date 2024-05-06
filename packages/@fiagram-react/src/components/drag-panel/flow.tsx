import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { PanelView } from '../panel-view'
import { FlowIcons } from '../../shapes'

const { Begin } = FlowIcons

export const FlowPanelOverlay: FC = () => {
  const { t } = useTranslation()
  const dragItems = [
    { key: 'dragList1', name: 'drag1', component: Begin },
    { key: 'dragList2', name: 'drag2', component: Begin },
    { key: 'dragList3', name: 'drag3', component: Begin },
    { key: 'dragList4', name: 'drag4', component: Begin },
    { key: 'dragList5', name: 'drag5', component: Begin },
    { key: 'dragList6', name: 'drag6', component: Begin },
  ]

  return (
    <PanelView
      title={t('translation:flow-chart')}
      dragList={dragItems}
    />
  )
}
