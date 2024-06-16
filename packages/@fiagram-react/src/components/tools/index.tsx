import React, { Fragment } from 'react'
import type { ReactNode } from 'react'
import { DirectionAlign } from './direction-align'
import { Align } from './align'
import { FullScreen } from './full-screen'
import { Scale } from './scale'
import { Marquee } from './marquee'
import { Zoom } from './zoom'
import { Delete } from './delete.tsx'

interface IProps {
  children?: ReactNode[]
}

interface ITools extends React.FC<IProps> {
  Align: typeof Align
  DirectionAlign: typeof DirectionAlign
  FullScreen: typeof FullScreen
  Scale: typeof Scale
  Marquee: typeof Marquee
  Zoom: typeof Zoom
  Delete: typeof Delete
}

const Tools: ITools = ({ children }) => {
  const defaultTools = (
    <Fragment>
      {/* <DirectionAlign /> */}
      {/* <Align /> */}
      <FullScreen />
      <Scale />
      <Marquee />
      <Zoom />
      <Delete />
    </Fragment>
  )
  return (
    <div className="fiagram-tools">
      {children?.length ? children : defaultTools}
    </div>
  )
}

Tools.Align = Align
Tools.DirectionAlign = DirectionAlign
Tools.FullScreen = FullScreen
Tools.Scale = Scale
Tools.Marquee = Marquee
Tools.Zoom = Zoom
Tools.Delete = Delete

Tools.displayName = 'Tools'

export { Tools }
