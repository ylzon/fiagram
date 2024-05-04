"use strict";(self.webpackChunk_fiagram_docs=self.webpackChunk_fiagram_docs||[]).push([[554],{15378:function(d,n,e){e.r(n),e.d(n,{demos:function(){return l}});var a=e(29008),r=e.n(a),o=e(70958),m=e.n(o),s=e(92379),l={"src-example-demo-base":{component:s.memo(s.lazy(function(){return e.e(433).then(e.bind(e,70931))})),asset:{type:"BLOCK",id:"src-example-demo-base",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(9747).Z},react:{type:"NPM",value:"18.3.1"},"@fiagram/react":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{react:e(92379),"@fiagram/react":e(47582)},renderOpts:{compile:function(){var u=m()(r()().mark(function c(){var i,p=arguments;return r()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(729).then(e.bind(e,3729));case 2:return t.abrupt("return",(i=t.sent).default.apply(i,p));case 3:case"end":return t.stop()}},c)}));function h(){return u.apply(this,arguments)}return h}()}}}},47582:function(d,n,e){e.r(n),e.d(n,{Diagram:function(){return r}});var a=e(651),r=function(){return(0,a.jsx)("div",{children:"App "})}},16963:function(d,n,e){e.r(n),e.d(n,{texts:function(){return a}});const a=[{value:"\u57FA\u7840\u529F\u80FD\u6F14\u793A",paraId:0,tocIndex:0}]},9747:function(d,n){n.Z=`import React, { type FC } from 'react'
import { Diagram } from '@fiagram/react'

const NodeShape: FC = ({ x, y, width, height, name }: any) => {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="white" stroke="black" />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" alignmentBaseline="middle">{name}</text>
    </g>
  )
}

const App: FC = () => {
  return (
    <Diagram
      shapes={[
        { name: 'node1', shape: NodeShape },
      ]}
      nodes={[
        { id: '1', x: 100, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 1' },
        { id: '2', x: 300, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 2' },
        { id: '3', x: 500, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 3' },
      ]}
      edges={[
        { id: '1', type: 'BROKEN_ROUNDED', source: '1', sourceDirection: 'BOTTOM', target: '2', targetDirection: 'TOP', name: 'Link 1' },
        { id: '2', type: 'BROKEN_ROUNDED', source: '2', sourceDirection: 'BOTTOM', target: '3', targetDirection: 'TOP', name: 'Link 2' },
      ]}
    />
  )
}

export default App
`}}]);
