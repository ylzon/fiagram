import React from 'react'
import type { Node } from '../../types/nodes'
import type { Shapes } from '../../types/diagram'

interface TextCenterProps {
  y?: string
  color?: string
  label?: string
}

const nodeInfo: Node = {
  id: 'flow-id',
  x: 0,
  y: 0,
  width: 150,
  height: 40,
  shape: 'flow',
}

const TextCenter: React.FC<TextCenterProps> = ({ color, y, label }) => (
  <text
    x="50%"
    y={y || '51%'}
    textAnchor="middle"
    dominantBaseline="middle"
    fill={color || 'white'}
    fontSize="13"
    fontWeight="600"
    letterSpacing="0em"
  >
    {label}
  </text>
)

export const flowList: Shapes = [
  {
    key: 'start',
    label: 'Start',
    nodeInfo,
    component: ({ width, height, label }) => (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect width={width} height={height} rx={height / 2} fill="#3A3D87" />
        <TextCenter label={label} />
      </svg>
    ),
  },
  {
    key: 'process',
    label: 'Process',
    nodeInfo,
    component: ({ width, height, label }) => (
      <svg width={width + 2} height={height + 3} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" fill="#DB9730" fillOpacity="0.2" />
        <rect x={1.5} y={0} width={width - 3} height={height} rx="6" stroke="#DB9730" strokeWidth="2" />
        <TextCenter label={label} color="#DB9730" />
      </svg>
    ),
  },
  {
    key: 'decision',
    label: 'Decision',
    nodeInfo,
    component: ({ width, height: H, label }) => {
      const height = H * 1.3
      const widthRatio = width / 350
      const heightRatio = height / 188
      return (
        (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height - 2}`} fill="none">
            <path
              d={`M${172.231 * widthRatio} ${1.75346 * heightRatio}L${10.2412 * widthRatio} ${85.9881 * heightRatio}C${5.93029 * widthRatio} ${88.2297 * heightRatio} ${5.93029 * widthRatio} ${94.3972 * heightRatio} ${10.2412 * widthRatio} ${96.6389 * heightRatio}L${172.231 * widthRatio} ${180.873 * heightRatio}C${173.967 * widthRatio} ${181.776 * heightRatio} ${176.033 * widthRatio} ${181.776 * heightRatio} ${177.769 * widthRatio} ${180.873 * heightRatio}L${339.759 * widthRatio} ${96.6389 * heightRatio}C${344.07 * widthRatio} ${94.3972 * heightRatio} ${344.07 * widthRatio} ${88.2297 * heightRatio} ${339.759 * widthRatio} ${85.9881 * heightRatio}L${177.769 * widthRatio} ${1.75347 * heightRatio}C${176.033 * widthRatio} ${0.850845 * heightRatio} ${173.967 * widthRatio} ${0.850838 * heightRatio} ${172.231 * widthRatio} ${1.75346 * heightRatio}Z`}
              fill="#888DFF"
              fillOpacity="0.2"
              stroke="#888DFF"
              strokeWidth={2}
            />
            <TextCenter label={label} color="#856285" />
          </svg>
        )
      )
    },
  },
  {
    key: 'database',
    label: 'Database',
    nodeInfo,
    component: ({ width, height: H, label }) => {
      const height = H * 1.3
      const widthRatio = width / 234
      const heightRatio = height / 148
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height - 2}`} fill="none">
          <path
            d={`M${1.50226 * widthRatio} ${30.5377 * heightRatio}C${1.50226 * widthRatio} ${14.3976 * heightRatio} ${53.2129 * widthRatio} ${1.31348 * heightRatio} ${117.001 * widthRatio} ${1.31348 * heightRatio}C${180.789 * widthRatio} ${1.31348 * heightRatio} ${232.5 * widthRatio} ${14.3976 * heightRatio} ${232.5 * widthRatio} ${30.5377 * heightRatio}V${112.089 * heightRatio}C${232.5 * widthRatio} ${128.229 * heightRatio} ${180.789 * widthRatio} ${141.313 * heightRatio} ${117.001 * widthRatio} ${141.313 * heightRatio}C${53.2129 * widthRatio} ${141.313 * heightRatio} ${1.50226 * widthRatio} ${128.229 * heightRatio} ${1.50226 * widthRatio} ${112.089 * heightRatio}V${30.8006 * heightRatio}C${1.4994 * widthRatio} ${30.7101 * heightRatio} ${1.4991 * widthRatio} ${30.6214 * heightRatio} ${1.50226 * widthRatio} ${30.5377 * heightRatio}Z`}
            fill="#E5C105"
            fillOpacity="0.18"
          />
          <path
            d={`M${232.5 * widthRatio} ${30.5377 * heightRatio}C${232.5 * widthRatio} ${46.6777 * heightRatio} ${180.789 * widthRatio} ${59.7619 * heightRatio} ${117.001 * widthRatio} ${59.7619 * heightRatio}C${54.9297 * widthRatio} ${59.7619 * heightRatio} ${4.29455 * widthRatio} ${47.3726 * heightRatio} ${1.61386 * widthRatio} ${31.834 * heightRatio}C${1.56953 * widthRatio} ${31.5913 * heightRatio} ${1.48515 * widthRatio} ${30.9921 * heightRatio} ${1.50226 * widthRatio} ${30.5377 * heightRatio}M${232.5 * widthRatio} ${30.5377 * heightRatio}C${232.5 * widthRatio} ${14.3976 * heightRatio} ${180.789 * widthRatio} ${1.31348 * heightRatio} ${117.001 * widthRatio} ${1.31348 * heightRatio}C${53.2129 * widthRatio} ${1.31348 * heightRatio} ${1.50226 * widthRatio} ${14.3976 * heightRatio} ${1.50226 * widthRatio} ${30.5377 * heightRatio}M${232.5 * widthRatio} ${30.5377 * heightRatio}V${112.089 * heightRatio}C${232.5 * widthRatio} ${128.229 * heightRatio} ${180.789 * widthRatio} ${141.313 * heightRatio} ${117.001 * widthRatio} ${141.313 * heightRatio}C${53.2129 * widthRatio} ${141.313 * heightRatio} ${1.50226 * widthRatio} ${128.229 * heightRatio} ${1.50226 * widthRatio} ${112.089 * heightRatio}V${30.5377 * heightRatio}`}
            stroke="#E5C105"
            strokeWidth="2"
          />
          <TextCenter label={label} color="#E5C105" y="70%" />
        </svg>

      )
    },
  },
  {
    key: 'decision',
    label: 'Decision',
    nodeInfo,
    component: ({ width, height, label }) => {
      const widthRatio = width / 350
      const heightRatio = height / 104
      return (
        (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d={`M${41.2019 * widthRatio} ${5.45596 * heightRatio}L${3.57566 * widthRatio} ${93.4512 * heightRatio}C${1.88229 * widthRatio} ${97.4114 * heightRatio} ${4.7876 * widthRatio} ${101.813 * heightRatio} ${9.09467 * widthRatio} ${101.813 * heightRatio}H${303.279 * widthRatio}C${305.682 * widthRatio} ${101.813 * heightRatio} ${307.853 * widthRatio} ${100.38 * heightRatio} ${308.798 * widthRatio} ${98.171 * heightRatio}L${346.424 * widthRatio} ${10.1758 * heightRatio}C${348.118 * widthRatio} ${6.21554 * heightRatio} ${345.212 * widthRatio} ${1.81348 * heightRatio} ${340.905 * widthRatio} ${1.81348 * heightRatio}H${46.7209 * widthRatio}C${44.318 * widthRatio} ${1.81348 * heightRatio} ${42.1466 * widthRatio} ${3.24655 * heightRatio} ${41.2019 * widthRatio} ${5.45596 * heightRatio}Z`}
              fill="#3A3D87"
              fillOpacity="0.2"
              stroke="#3A3D87"
              strokeWidth="2"
            />
            <TextCenter label={label} color="#3A3D87" />
          </svg>
        )
      )
    },
  },
  {
    key: 'end',
    label: 'End',
    nodeInfo,
    component: ({ width, height, label }) => (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <rect width={width} height={height} rx={height / 2} fill="#1CB273" />
        <TextCenter label={label} />
      </svg>
    ),
  },
]
