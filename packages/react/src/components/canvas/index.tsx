import React, { forwardRef, useImperativeHandle } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '../../types/diagram'

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
    <div className={cls('fiagram-grid', { hideGrid })}>
      画布
    </div>
  )
})

export { Canvas }
