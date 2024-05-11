import * as d3 from 'd3'
import { type RefObject, useEffect } from 'react'
import type { SvgInfo } from '../types/diagram'
import { useDiagramStore } from './useDiagramStore'

export function useSvgInfo(svgTarget: RefObject<SVGSVGElement>, auxiliaryTarget: RefObject<SVGGElement>) {
  const { state, setSvgInfo } = useDiagramStore(state => state)
  const { zoomConfig } = state
  const defaultZoomConfig = (zoomAreaEl: any) => d3
    .zoom()
    // .scaleExtent([1 / 5, 4])
    .on('zoom', () => {
      zoomAreaEl.attr('transform', (d3 as any).event.transform)
    })
  const auxiliaryElement = auxiliaryTarget.current
  const svgElement = svgTarget.current
  useEffect(() => {
    if (!svgElement || !auxiliaryElement) return
    const svgD3 = d3.select(svgElement)
    const zoomAreaD3 = svgD3.select('.zoom-area')
    const marqueeWrapD3 = svgD3.select('.marquee-wrap')
    const newSvgInfo: SvgInfo = {
      svg: svgD3,
      svgDOM: svgElement,
      svgZoomArea: zoomAreaD3,
      auxiliary: svgD3.select('.auxiliary'),
      zoom: (zoomConfig || defaultZoomConfig)(zoomAreaD3),
      marqueeSelect: marqueeWrapD3.select('.marquee-select'),
      marqueeSelectCopy: marqueeWrapD3.select('.marquee-select-copy'),
    }
    // 初始化辅助线
    Array.from(auxiliaryElement?.childNodes || []).forEach((item: any) => {
      const key = item?.getAttribute('data-svgKey')
      newSvgInfo[key] = svgD3.select(`#${item.id}`)
    })
    setSvgInfo(newSvgInfo)
  }, [auxiliaryElement, svgElement])

  return null
}
