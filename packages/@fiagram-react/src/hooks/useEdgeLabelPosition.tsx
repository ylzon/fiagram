import type { RefObject } from 'react'
import { useLayoutEffect } from 'react'
import * as d3 from 'd3'
import _ from 'lodash'
import type { Edge } from '@fiagram/core/types/edges'
import { maxTitleWidth } from '@fiagram/core/src/constant'
import { useDiagramStore } from './useDiagramStore'

export function useEdgeLabelPosition(textRef: RefObject<SVGGElement>, data: Edge) {
  const { state } = useDiagramStore(state => state)

  const { edgeProps } = state
  const { label, centerX, centerY, pathD } = data

  const labelProps = _.mergeWith({}, data.labelProps, edgeProps?.labelProps, (a, b) => {
    return a || b
  })
  const style = _.mergeWith({}, data.style, edgeProps?.style, (a, b) => a || b)

  const truncateTitle = (textDom: any) => {
    let titleLen = 0
    let startX = 20
    while (titleLen < maxTitleWidth) {
      const title = label?.slice(0, maxTitleWidth / startX--)

      textDom.text(`${title}...`)
      const newTitleBox = textDom.node().getBBox()
      titleLen = newTitleBox.width
    }
  }

  useLayoutEffect(() => {
    const g = d3.select(textRef.current)
    const rect = g.selectAll('rect')
    const text = g.select('text')
    const padding = labelProps?.padding
    const paddingHorizon = labelProps.paddingHorizon || padding || 12
    const paddingVertical = labelProps.paddingVertical || padding || 4
    const textNode: any = text.node()
    if (textNode) {
      let textBox = textNode.getBBox()

      const needTruncateTitle = typeof label === 'string' && textBox.width > maxTitleWidth

      if (needTruncateTitle) {
        truncateTitle(text)
        textBox = textNode.getBBox()
      }
      rect.attr('y', textBox.y - paddingVertical / 2)
      rect.attr('x', textBox.x - paddingHorizon / 2)
      rect.attr('width', textBox.width + paddingHorizon)
      rect.attr('height', textBox.height + paddingVertical)

      const translate = { x: centerX, y: 0 }

      if (data?.type === 'broken' || data?.type === 'broken-rounded') {
        translate.y = centerY + textBox.height / 2 + textBox.y / 4
      } else {
        const offset = 4
        translate.y = centerY + offset
      }

      g.attr('transform', `translate(${translate.x}, ${translate.y})`)
    }
  }, [name, pathD, centerX, centerY, data.type, style])
}
