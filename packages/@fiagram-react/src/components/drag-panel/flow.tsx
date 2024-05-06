import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const Flow: FC<IProps> = () => {
  const { t } = useTranslation()

  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title: t('translation:flow-chart'), icon: 'tuoputu' },
    { key: '2', title: t('translation:resource'), icon: 'fuwuqi' },
    { key: '3', title: t('translation:more'), icon: 'diandian' },
  ]

  return (
    <ToolbarGroup
      group={toolsGroup}
      trigger={['hover', 'click']}
      placement="rightTop"
    />
  )
}
