import * as d3 from 'd3'
import type { SvgInfo } from '@fiagram/core/types/diagram'

/**
 * 缩放平移到中心点
 * @param svgInfo
 * @param duration
 * @param defaultScale
 * @param callback
 */
export function zoomCentroid(svgInfo: SvgInfo, duration = 0, defaultScale?: number, callback?: () => void) {
  const isFullScreen = document.fullscreenEnabled

  const canvas = isFullScreen
    ? { width: window.innerWidth, height: window.innerHeight }
    : (svgInfo?.svgDOM?.getBoundingClientRect() || { width: 0, height: 0 })

  const containerBox = svgInfo.svgZoomArea.node().getBBox()
  const percentage = 0.95

  const scaleW = (canvas.width * percentage) / containerBox.width
  const scaleH = (canvas.height * percentage) / containerBox.height
  const scale = Math.min(scaleW, scaleH, 1)

  const transform = {
    x: (canvas.width / 2) - (scale * (containerBox.width / 2 + containerBox.x)),
    y: (canvas.height / 2) - (scale * (containerBox.height / 2 + containerBox.y)),
  }

  const applyTransform = () => d3.zoomIdentity.translate(transform.x, transform.y).scale(defaultScale || scale)

  if (duration > 0) {
    svgInfo.svg
      .transition()
      .duration(duration)
      .call(svgInfo.zoom.transform, applyTransform)
      .on('end', callback)
  } else {
    svgInfo.svg.call(svgInfo.zoom.transform, applyTransform)
  }
}
