import React, { useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { KEY_CODES } from '@fiagram/core/src/constant'
import * as d3 from 'd3'
import type { SvgInfo, XY2Coord, XYCoord } from '@fiagram/core/types/diagram'
import { findNodeFromTree } from '@fiagram/core/src/utils/diagram'
import type { Node, Nodes } from '@fiagram/core/types/nodes'
import _ from 'lodash'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { useDiagramStore } from '../../hooks/useDiagramStore'

interface IProps {}

export function closeMarquee(svgInfo?: SvgInfo) {
  if (svgInfo?.svg) {
    svgInfo.svg.classed('marquee-finished', false)
    svgInfo.svg.call(svgInfo.zoom).on('dblclick.zoom', null)
    svgInfo?.marqueeSelect.attr('d', 'M 0 0').attr('transform', '')
    svgInfo?.marqueeSelectCopy.attr('d', 'M 0 0').attr('transform', '')
    svgInfo?.marqueeSelectCopy.on('mousedown.drag', null)
  }
}

export const Marquee: FC<IProps> = () => {
  const { t } = useTranslation()
  const [active, setActive] = useState<boolean>(false)
  const { state, setMarqueeNodes, getState, updateNodes } = useDiagramStore(state => state)
  const { svgInfo, nodes } = state

  function dragMarqueeConfig() {
    let dragged = false
    const startPos = { x: 0, y: 0 }
    const offsetW = 0 // 拖动区域宽度
    const offsetH = 0 // 工具拦的高度
    return d3
      .drag()
      .on('start', (e) => {
        dragged = false
        svgInfo?.svg.classed('marquee', true)
        svgInfo?.svg.classed('marquee-finished', false)

        startPos.x = e.x - offsetW
        startPos.y = e.y - offsetH
      })
      .on('drag', (e) => {
        dragged = true
        const endPos = { x: 0, y: 0 }
        endPos.x = e.x - offsetW
        endPos.y = e.y - offsetH
        svgInfo?.marqueeSelect.attr(
          'd',
          `M ${startPos.x} ${startPos.y} H ${endPos.x} V ${endPos.y} H ${startPos.x} Z`,
        )
      })
      .on('end', (e) => {
        if (dragged) {
          // ctrl 拖动事件
          const endPos = { x: 0, y: 0 }
          endPos.x = e.x - offsetW
          endPos.y = e.y - offsetH

          const box = {
            x1: startPos.x,
            y1: startPos.y,
            x2: endPos.x,
            y2: endPos.y,
          }

          if (endPos.x < startPos.x) {
            box.x2 = startPos.x
            box.x1 = endPos.x
          }
          if (endPos.y < startPos.y) {
            box.y2 = startPos.y
            box.y1 = endPos.y
          }

          // svgInfo?.marqueeSelect.attr('d', 'M 0 0');
          const marqueeNodes = findMarqueeNodes(nodes || [], box)
          setMarqueeNodes(marqueeNodes)
          stopMarquee()
        }
      })
  }

  function dotIsInside(wrap: XY2Coord, dot: XYCoord) {
    return dot.x > wrap.x1 && dot.x < wrap.x2 && dot.y > wrap.y1 && dot.y < wrap.y2
  }

  function isInsideBox(box: XY2Coord, item: Node) {
    const leftTop = { x: 0, y: 0 }
    const rightTop = { x: 0, y: 0 }
    const leftBottom = { x: 0, y: 0 }
    const rightBottom = { x: 0, y: 0 }

    const svgTransform = d3.zoomTransform(svgInfo?.svg.node())

    const node = findNodeFromTree(nodes || [], item?.id || '')

    leftTop.x = (node?.relativeX || 0) * svgTransform.k + svgTransform.x
    leftTop.y = (node?.relativeY || 0) * svgTransform.k + svgTransform.y

    rightTop.x = ((node?.relativeX || 0) + (node?.width || 0)) * svgTransform.k + svgTransform.x
    rightTop.y = (node?.relativeY || 0) * svgTransform.k + svgTransform.y

    leftBottom.x = (node?.relativeX || 0) * svgTransform.k + svgTransform.x
    leftBottom.y = ((node?.relativeY || 0) + (node?.height || 0)) * svgTransform.k + svgTransform.y

    rightBottom.x = ((node?.relativeX || 0) + (node?.width || 0)) * svgTransform.k + svgTransform.x
    rightBottom.y = ((node?.relativeY || 0) + (node?.height || 0)) * svgTransform.k + svgTransform.y

    return (
      dotIsInside(box, leftTop)
      && dotIsInside(box, rightTop)
      && dotIsInside(box, leftBottom)
      && dotIsInside(box, rightBottom)
    )
  }

  function findMarqueeNodes(nodes: Nodes, box: XY2Coord) {
    if (_.isEmpty(nodes)) {
      return []
    }
    let marqueeNodes: Nodes = []
    _.map(nodes, (node) => {
      if (isInsideBox(box, node)) {
        marqueeNodes = marqueeNodes.concat(node)
      }
      // else {
      //     marqueeNodes = marqueeNodes.concat(findMarqueeNodes(node.children, box));
      // }
    })
    return marqueeNodes
  }

  function moveMarqueeConfig() {
    let offsetX = 0
    let offsetY = 0

    // 多次位移时参考上次缩放状态
    let lastTimeTransform = { x: 0, y: 0 }

    svgInfo?.marqueeSelectCopy.attr('d', svgInfo?.marqueeSelect.attr('d'))

    function findOriginCoord(dom: any) {
      let translateX = 0
      let translateY = 0
      const transform = dom.attr('transform')
      if (transform) {
        ;[translateX, translateY] = transform.match(/(-?[0-9.]+)/g)
      }
      return [+translateX, +translateY]
    }
    return d3
      .drag()
      .on('start', (e) => {
        const [translateX, translateY] = findOriginCoord(svgInfo?.marqueeSelectCopy)
        offsetX = e.x - translateX
        offsetY = e.y - translateY
      })
      .on('drag', (e) => {
        svgInfo?.marqueeSelectCopy.attr(
          'transform',
          `translate(${e.x - offsetX}, ${e.y - offsetY})`,
        )
      })
      .on('end', () => {
        const { marqueeNodes, nodes } = getState()
        let newNodes = _.cloneDeep(nodes)
        const marqueeNodeIds = _.map(marqueeNodes, 'id')

        const [translateX, translateY] = findOriginCoord(svgInfo?.marqueeSelectCopy)
        const svgTransform = d3.zoomTransform(svgInfo?.svg.node())

        const diffX = translateX - lastTimeTransform.x
        const diffY = translateY - lastTimeTransform.y
        const offsetX = diffX / svgTransform.k
        const offsetY = diffY / svgTransform.k
        newNodes = _.map(_.cloneDeep(newNodes), (node: any) => {
          if (_.includes(marqueeNodeIds, node.id)) {
            node.x += offsetX
            node.y += offsetY
          }
          return node
        })

        lastTimeTransform = { x: translateX, y: translateY }

        svgInfo?.marqueeSelect.attr('transform', svgInfo?.marqueeSelectCopy.attr('transform'))
        updateNodes(newNodes)
      })
  }

  function startMarquee() {
    svgInfo?.svg.on('mousedown.zoom', null)
    svgInfo?.svg.call(dragMarqueeConfig())
    setActive(true)
  }

  const stopMarquee = () => {
    svgInfo?.svg.on('mousedown.drag', null)
    svgInfo?.svg.classed('marquee', false)
    svgInfo?.svg.classed('marquee-finished', true)
    svgInfo?.marqueeSelectCopy.call(moveMarqueeConfig())
    setActive(false)
  }

  return (
    <ToolbarGroup
      group={[
        {
          key: 'marquee',
          title: t('translation:marquee'),
          icon: 'icon-marquee',
          keyCodes: KEY_CODES.Alt,
          active,
          onKeyDown: startMarquee,
          onKeyUp: () => {
            const hasDragged = svgInfo?.svg.classed('marquee') || svgInfo?.svg.classed('marquee-finished')
            if (!hasDragged) {
              stopMarquee()
              closeMarquee(svgInfo)
            }
          },
          onClick: active ? stopMarquee : startMarquee,
        },
      ]}
    />
  )
}
