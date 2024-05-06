import React from 'react'
import type { FC } from 'react'
import type { DragItemProps } from './drag-item.tsx'
import { DragItem } from './drag-item.tsx'

interface IProps {
  dragList: DragItemProps[]
}

export const DragList: FC<IProps> = ({ dragList }) => {
  return dragList?.map(item => (
    <DragItem key={`drag-${item.key}`} {...item} />
  ))
}
