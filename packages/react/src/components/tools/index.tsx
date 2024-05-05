import React from 'react'
import './index.scss'
import { Icon } from '../icon'

interface IProps {
  hideTools?: boolean
}

export const Tools: React.FC<IProps> = ({ hideTools }) => {
  if (hideTools)
    return null

  return (
    <div className="fiagram-tools">
      <Icon type="shangduiqi" />
      <Icon type="xiaduiqi" />
      <Icon type="zuoduiqi1" />
      <Icon type="youduiqi1" />
      <Icon type="duiqi_duiqi_zongxiangfenbu" />
      <Icon type="duiqi_duiqi_hengxiangfenbu" />
    </div>
  )
}
