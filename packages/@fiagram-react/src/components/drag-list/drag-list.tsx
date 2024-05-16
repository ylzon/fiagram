import React from 'react'
import type { FC } from 'react'
import type { Shapes } from '@fiagram/core/types/diagram'
import { DragItem } from './drag-item.tsx'

interface IProps {
  dragList: Shapes
}

export const DragList: FC<IProps> = ({ dragList }) => {
  return dragList?.map(({ shape, ...item }) => (
    <DragItem shape={shape} {...item} />
  ))
}
