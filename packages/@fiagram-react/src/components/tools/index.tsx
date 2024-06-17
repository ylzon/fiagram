import React, { Fragment } from 'react'
import type { ReactNode } from 'react'
import { AutoLayout } from './auto-layout.tsx'
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
  AutoLayout: typeof AutoLayout
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
      <FullScreen />
      <Scale />
      <Marquee />
      <Zoom />
      <Delete />
      <Align />
    </Fragment>
  )
  return (
    <div className="fiagram-tools">
      {children?.length ? children : defaultTools}
    </div>
  )
}

Tools.Align = Align
Tools.AutoLayout = AutoLayout
Tools.FullScreen = FullScreen
Tools.Scale = Scale
Tools.Marquee = Marquee
Tools.Zoom = Zoom
Tools.Delete = Delete

Tools.displayName = 'Tools'

export { Tools }
