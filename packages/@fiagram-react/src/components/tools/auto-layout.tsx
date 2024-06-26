import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const AutoLayout: FC<IProps> = () => {
  const { t } = useTranslation()

  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title: t('translation:horizonAlign'), icon: 'icon-vertically-centered' },
    { key: '2', title: t('translation:horizonCenter'), icon: 'icon-distributions-centered' },
    { key: '3', title: t('translation:horizonLayout'), icon: 'icon-horizontal-centered' },
  ]

  return (
    <ToolbarGroup
      group={toolsGroup}
      trigger="hover"
      placement="bottom"
    />
  )
}
