import React, { useEffect } from 'react'
import type { IconFontType } from '@fiagram/core/types/icon'
import { KeyBindEvent } from '@fiagram/core/src/utils/KeyBindEvent.ts'
import cls from 'classnames'
import { Icon } from '../icon'
import type { PopoverProps } from '../popover'
import { Popover } from '../popover'
import { useDiagramStore } from '../../hooks/useDiagramStore.ts'

const alignMap = {
  rightTop: { offset: [14, 0], targetOffset: [0, 7] },
  bottom: { offset: [0, 14], targetOffset: [-7, 0] },
}

export interface ToolBarItemProps {
  key?: string | number
  icon: IconFontType
  title?: string
  placement?: keyof typeof alignMap
  trigger?: PopoverProps['trigger']
  overlay?: PopoverProps['overlay']
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  keyCodes?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onKeyUp?: (e: KeyboardEvent) => void
  disabled?: boolean
  active?: boolean
}

export const ToolbarItem: React.FC<ToolBarItemProps> = (props) => {
  const {
    icon,
    title,
    trigger = 'hover',
    onClick,
    overlay,
    placement = 'bottom',
    active = false,
  } = props
  const { state } = useDiagramStore(state => state)
  const { svgInfo } = state

  useEffect(() => {
    let keyEventHandle = null
    if (svgInfo?.svgDOM && props.keyCodes) {
      keyEventHandle = new KeyBindEvent({
        keyCode: props.keyCodes,
        keydown: props.onKeyDown,
        keyup: props.onKeyUp,
        dom: svgInfo?.svgDOM?.parentNode,
      })
    }
    return () => {
      keyEventHandle && keyEventHandle.removeEvent()
    }
  }, [svgInfo?.svgDOM, props.disabled, props.active])

  return (
    <Popover
      trigger={trigger}
      // visible={icon === 'icon-topology'}
      overlay={overlay || title || ''}
      align={alignMap[placement]}
      placement={placement}
      className={cls('fiagram-tools-item', { active })}
    >
      <Icon
        type={icon}
        onClick={onClick}
        style={icon === 'icon-marquee' ? { position: 'relative', left: '2px', top: '1px' } : {}}
      />
    </Popover>
  )
}
