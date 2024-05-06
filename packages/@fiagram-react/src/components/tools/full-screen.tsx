import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolbarGroup } from '../toolbar/group.tsx'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'

interface IProps {}

export const FullScreen: FC<IProps> = () => {
  const isFullscreen = false
  const { t } = useTranslation()
  const icon = (isFullscreen ? 'icon-exit-fullscreen' : 'icon-fullscreen') as IconFontType
  const title = isFullscreen ? t('translation:exitFullScreen') : t('translation:fullScreen')
  const toolsGroup: ToolBarItemProps[] = [
    { key: '1', title, icon },
  ]

  return (
    <ToolbarGroup group={toolsGroup} />
  )
}
