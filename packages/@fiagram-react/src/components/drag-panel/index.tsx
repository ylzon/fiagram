import React, { Fragment } from 'react'
import type { ReactNode } from 'react'
import { DragList } from './drag-list.tsx'

interface IProps {
  children?: ReactNode[]
}

interface ITools extends React.FC<IProps> {
}

const DragPanel: ITools = ({ children }) => {
  const defaultTools = (
    <Fragment>
      <DragList />
    </Fragment>
  )
  return (
    <div className="fiagram-tools vertical left-top">
      {children?.length ? children : defaultTools}
    </div>
  )
}

DragPanel.displayName = 'DragPanel'

export { DragPanel }
