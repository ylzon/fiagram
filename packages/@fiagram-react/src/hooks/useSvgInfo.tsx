import * as d3 from 'd3'
import { type RefObject, useEffect } from 'react'
import type { DiagramState, SvgInfo } from '@fiagram/core/types/diagram'
import { isValidScaleExtent } from '@fiagram/core/src/utils/diagram'
import _ from 'lodash'
import type { CanvasProps } from '../components/canvas'
import { zoomCentroid } from '../utils/animation.ts'
import { closeMarquee } from '../components/tools/marquee.tsx'
import { useDiagramStore } from './useDiagramStore'

export function useSvgInfo(svgTarget: RefObject<SVGSVGElement>, auxiliaryTarget: RefObject<SVGGElement>, props: CanvasProps) {
  const { state, setSvgInfo, setState } = useDiagramStore(state => state)
  const { svgInfo, zoomConfig, selectedNodes, selectedEdges } = state
  const { wheelZoomDisabled, dragZoomDisabled, scaleExtent } = props
  const auxiliaryElement = auxiliaryTarget.current
  const svgElement = svgTarget.current
  const defaultZoomConfig = (zoomAreaEl: SvgInfo['svgZoomArea']) => d3
    .zoom()
    .scaleExtent(scaleExtent && isValidScaleExtent(scaleExtent) ? scaleExtent : [1 / 5, 4])
    .on('zoom', (e) => {
      zoomAreaEl.attr('transform', e.transform)
    })
  const setSvgTranslateScale = (svg: SvgInfo['svg'], zoom: SvgInfo['zoom']) => {
    svg.call(zoom).on('dblclick.zoom', null) // 利用d3实现画布的平移缩放
    if (wheelZoomDisabled) svg.on('wheel.zoom', null)
    if (dragZoomDisabled) svg.on('mousedown.zoom', null)
  }

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
      zoom: (zoomConfig || defaultZoomConfig)(zoomAreaD3), // 可以自定义画布缩放平移的逻辑
      marqueeSelect: marqueeWrapD3.select('.marquee-select'),
      marqueeSelectCopy: marqueeWrapD3.select('.marquee-select-copy'),
    }

    // 配置画布的平移和缩放
    setSvgTranslateScale(svgD3, newSvgInfo.zoom)
    // 初始化辅助线
    Array.from(auxiliaryElement?.childNodes || []).forEach((item: any) => {
      const key = item?.getAttribute('data-svg-key')
      newSvgInfo[key] = svgD3.select(`#${item.id}`)
    })
    // 禁用右键菜单
    svgD3.on('contextmenu', (e) => {
      e.preventDefault()
    })
    // 居中画布
    zoomCentroid({ ...newSvgInfo })
    setSvgInfo(newSvgInfo)
  }, [auxiliaryElement, svgElement])

  // 画布点击后取消选中
  useEffect(() => {
    const { svg } = state.svgInfo || {}
    if (svg) {
      svg.on('click', (e: any) => {
        e.preventDefault()
        if (e?.srcElement?.tagName === 'svg') {
          const newState: DiagramState = _.cloneDeep(state)
          // 清除框选数据
          if (svg.classed('marquee-finished') || svg.classed('marquee')) {
            closeMarquee(svgInfo)
            newState.marqueeNodes = []
          }
          // 清除选中节点
          if (selectedNodes && selectedNodes.length > 0) {
            newState.selectedNodes = []
          }
          // 清除选中边
          if (selectedEdges && selectedEdges.length > 0) {
            newState.selectedEdges = []
          }
          setState(newState)
        }
      })
    }
  })

  // 开关变化后重新设置画布是否开启平移和缩放
  useEffect(() => {
    if (svgInfo?.svg) {
      setSvgTranslateScale(svgInfo.svg, svgInfo.zoom)
    }
  }, [wheelZoomDisabled, dragZoomDisabled])

  return null
}
