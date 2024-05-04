import React from 'react'

interface IProps {
  hideTools?: boolean
}

export const Tools: React.FC<IProps> = ({ hideTools }) => {
  if (hideTools)
    return null

  return (
    <div className="fiagram-tools">
      Tools
    </div>
  )
}
