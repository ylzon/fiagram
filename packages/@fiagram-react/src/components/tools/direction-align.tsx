import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const DirectionAlign: FC<IProps> = () => {
  const { t } = useTranslation()

  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title: t('translation:topAlign'), icon: 'top-aligned' },
    { key: '2', title: t('translation:bottomAlign'), icon: 'bottom-aligned' },
    { key: '3', title: t('translation:leftAlign'), icon: 'left-aligned' },
    { key: '4', title: t('translation:rightAlign'), icon: 'right-aligned' },
    { key: '5', title: t('translation:verticalAlign'), icon: 'vertical-aligned' },
    { key: '6', title: t('translation:horizonAlign'), icon: 'horizontal-aligned' },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
