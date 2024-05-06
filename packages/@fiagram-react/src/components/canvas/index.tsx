import React, { forwardRef } from 'react'
import cls from 'classnames'
import type { DiagramProps } from '../../types/diagram'

interface IProps extends DiagramProps {
  restChilds?: React.ReactNode[]
}

interface IRef extends HTMLDivElement {
  // someMethod: () => void
}

const Canvas = forwardRef<IRef, IProps>((props, ref) => {
  const { hideGrid, restChilds } = props
  // useImperativeHandle(ref, () => ({
  //   // someMethod
  // }))

  return (
    <div className={cls('fiagram-canvas', { hideGrid })} ref={ref}>
      {restChilds?.map(restChild => restChild)}
    </div>
  )
})

export { Canvas }
