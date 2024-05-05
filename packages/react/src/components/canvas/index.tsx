import React, { forwardRef, useImperativeHandle } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '../../types/diagram'
import '@fiagram/core/styles/components/canvas.scss'

interface IProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef {
  // someMethod: () => void
}

const Canvas = forwardRef<IRef, IProps>((props, ref) => {
  const { hideGrid, restChilds } = props
  useImperativeHandle(ref, () => ({
    // someMethod
  }))

  return (
    <div className={cls('fiagram-canvas', { hideGrid })}>
      {restChilds?.map(restChild => restChild)}
    </div>
  )
})

export { Canvas }
