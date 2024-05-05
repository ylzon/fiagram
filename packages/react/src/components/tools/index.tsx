import React from 'react'
import { DirectionAlign } from './direction-align.tsx'
import './index.scss'
import { Align } from './align.tsx'
import { FullScreen } from './full-screen.tsx'

interface IProps {
  hideTools?: boolean
}

const Tools: React.FC<IProps> = ({ hideTools }) => {
  if (hideTools)
    return null

  return (
    <div className="fiagram-tools">
      <DirectionAlign />
      <FullScreen />
      <Align />
    </div>
  )
}

export { Tools }
