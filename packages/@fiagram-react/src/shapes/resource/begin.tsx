import React from 'react'
import type { FC } from 'react'
import type { Node } from '@fiagram/core/types/nodes'

export const Begin: FC<Node | undefined> = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="SVGRepo_tracer" transform="matrix(1, 0, 0, 1, 0, 0)">
          <g id="begin" fill="#000000">
            <path
              d="M512,0C229.2304,0,0,229.2304,0,512s229.2304,512,512,512s512-229.2304,512-512S794.7696,0,512,0z M512,960 C265.3184,960,64,758.6816,64,512S265.3184,64,512,64s448,201.3184,448,448S758.6816,960,512,960z"
            >
            </path>
            <path
              d="M512,192c-17.6768,0-32,14.3232-32,32v224c0,17.6768,14.3232,32,32,32s32-14.3232,32-32V224 C544,206.3232,529.6768,192,512,192z"
            >
            </path>
            <path
              d="M512,576c-17.6768,0-32,14.3232-32,32v224c0,17.6768,14.3232,32,32,32s32-14.3232,32-32V608 C544,590.3232,529.6768,576,512,576z"
            >
            </path>
          </g>
        </g>
      </g>
    </svg>
  )
}
