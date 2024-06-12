import * as d3 from 'd3'
import { type RefObject, useEffect } from 'react'
import type { SvgInfo } from '@fiagram/core/types/diagram'
import _ from 'lodash'
import { useDiagramStore } from './useDiagramStore'

export function useSvgInfo(svgTarget: RefObject<SVGSVGElement>, auxiliaryTarget: RefObject<SVGGElement>) {
  const { state, setSvgInfo, setState } = useDiagramStore(state => state)
  const { zoomConfig, selectedNodes, selectedEdges } = state
  const defaultZoomConfig = (zoomAreaEl: any) => d3
    .zoom()
    // .scaleExtent([1 / 5, 4])
    .on('zoom', () => {
      zoomAreaEl.attr('transform', (d3 as any).event.transform)
    })
  const auxiliaryElement = auxiliaryTarget.current
  const svgElement = svgTarget.current

  // 处理svg信息
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
      const key = item?.getAttribute('data-svg-key')
      newSvgInfo[key] = svgD3.select(`#${item.id}`)
    })
    // 禁用右键菜单
    svgD3.on('contextmenu', (e) => {
      e.preventDefault()
    })
    setSvgInfo(newSvgInfo)
  }, [auxiliaryElement, svgElement])

  // 实时监控画布状态
  useEffect(() => {
    const { svg } = state.svgInfo || {}
    // 画布点击后取消选中
    if (svg) {
      svg.on('click', (e: any) => {
        e.preventDefault()
        if (e?.srcElement?.tagName === 'svg') {
          const newState = _.cloneDeep(state)
          if (selectedNodes && selectedNodes.length > 0) {
            newState.selectedNodes = []
          }
          if (selectedEdges && selectedEdges.length > 0) {
            newState.selectedEdges = []
          }
          setState(newState)
        }
      })
    }
  })
  return null
}
