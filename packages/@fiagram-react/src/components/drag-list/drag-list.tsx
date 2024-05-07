import React from 'react'
import type { FC } from 'react'
import type { Shapes } from '../../types/diagram'
import { DragItem } from './drag-item.tsx'

interface IProps {
  dragList: Shapes
}

export const DragList: FC<IProps> = ({ dragList }) => {
  return dragList?.map(({ key, ...item }) => (
    <DragItem key={key} {...item} />
  ))
}
