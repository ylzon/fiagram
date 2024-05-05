import React, { forwardRef, useImperativeHandle } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '../../types/diagram'
import './index.scss'

interface IProps extends DiagramProps {
}

interface IRef {
  // someMethod: () => void
}

// export const Canvas:  = forwardRef((props, ref) => {
const Canvas = forwardRef<IRef, IProps>((props, ref) => {
  const { hideGrid } = props
  useImperativeHandle(ref, () => ({
    // someMethod
  }))

  return (
    <div className={cls('fiagram-canvas', { hideGrid })}>
    </div>
  )
})

export { Canvas }
