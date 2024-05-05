import React from 'react'
import cls from 'classnames'

interface IProps {
  type: IconFontType
  className?: string
  style?: React.CSSProperties
}

export const Icon: React.FC<IProps> = (props) => {
  const { type, className, style } = props
  return (
    <i className={cls('iconfont', `icon${type}`, className)} style={style} />
  )
}
