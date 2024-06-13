import React, { Fragment } from 'react'
import type { ReactNode } from 'react'
import { DirectionAlign } from './direction-align.tsx'
import { Align } from './align.tsx'
import { FullScreen } from './full-screen.tsx'
import { Scale } from './scale.tsx'
import { Marquee } from './marquee.tsx'

interface IProps {
  children?: ReactNode[]
}

interface ITools extends React.FC<IProps> {
  Align: typeof Align
  DirectionAlign: typeof DirectionAlign
  FullScreen: typeof FullScreen
  Scale: typeof Scale
  Marquee: typeof Marquee
}

const Tools: ITools = ({ children }) => {
  const defaultTools = (
    <Fragment>
      {/* <DirectionAlign /> */}
      {/* <Align /> */}
      <FullScreen />
      <Scale />
      <Marquee />
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

Tools.displayName = 'Tools'

export { Tools }
