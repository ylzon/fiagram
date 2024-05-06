import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const DragList: FC<IProps> = () => {
  const { t } = useTranslation()

  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title: t('translation:flow-chart'), icon: 'icon-topology' },
    { key: '2', title: t('translation:resource'), icon: 'icon-server' },
    { key: '3', title: t('translation:more'), icon: 'icon-more' },
  ]

  return (
    <ToolbarGroup
      group={toolsGroup}
      trigger={['hover', 'click']}
      placement="rightTop"
    />
  )
}
