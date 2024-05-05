import React from 'react'
import cls from 'classnames'

interface IProps extends React.HTMLAttributes<HTMLElement> {
  type: IconFontType
  title?: string
  className?: string
  style?: React.CSSProperties
}

export const Icon: React.FC<IProps> = (props) => {
  const {
    type,
    className,
    style,
    title,
    ...rest
  } = props

  return (
    <i
      title={title}
      style={style}
      className={cls('iconfont', `icon${type}`, className)}
      {...rest}
    />
  )
}
