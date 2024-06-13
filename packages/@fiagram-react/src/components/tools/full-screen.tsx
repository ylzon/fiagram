import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { IconFontType } from '@fiagram/core/types/icon'
import { exitFullScreen, requestFullScreen } from '@fiagram/core/src/utils/fullscreen.ts'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { zoomCentroid } from '../../utils/animation.ts'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'

interface IProps {}

export const FullScreen: FC<IProps> = () => {
  const { state } = useDiagramStore(state => state)
  const { svgInfo } = state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement)
  const [beforeStyle, setBeforeStyle] = useState<string>('')
  const { t } = useTranslation()
  const icon = (isFullscreen ? 'icon-exit-fullscreen' : 'icon-fullscreen') as IconFontType
  const title = isFullscreen ? t('translation:exitFullScreen') : t('translation:fullScreen')
  const moveCentroid = () => {
    setTimeout(() => {
      zoomCentroid(svgInfo || {}, 600)
    }, 700)
  }
  const handleSwitchFullScreen = () => {
    if (isFullscreen) {
      svgInfo?.svgDOM?.setAttribute('style', beforeStyle)
      exitFullScreen()
    } else {
      setBeforeStyle(svgInfo?.svgDOM?.getAttribute('style') || '')
      svgInfo?.svgDOM?.setAttribute('style', `${beforeStyle}width: 100%; height: 100%;`)
      requestFullScreen(svgInfo?.svgDOM?.parentNode).on('esc', () => {
        setIsFullscreen(false)
        moveCentroid()
      })
    }
    setIsFullscreen(!isFullscreen)
    moveCentroid()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <ToolbarGroup
      group={[
        { key: '1', title, icon, onClick: handleSwitchFullScreen },
      ]}
    />
  )
}
