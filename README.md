![fiagram-logo.png](docs/public/fiagram-logo.png)


基于 SVG + D3.js，可快速构建出拓扑图、流程图等可视化图形组件

> WIP 项目，目前仅支持 React

### Installation

```bash
npm install @fiagram/react
```

```bash
pnpm add @fiagram/react
```

### Todo
React 
* [x] 支持 i18n 多语言
* [x] 支持 CSS var
* [ ] 支持黑白主题
* [ ] 预置FlowChart、Topology等常用图形

Vue
* [ ] WIP

### React Usage

```javascript
import { Diagram } from '@fiagram/react';

const NodeShape = ({ x, y, width, height, name }) => {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="white" stroke="black" />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" alignmentBaseline="middle">{name}</text>
    </g>
  );
};

const App = () => {
  return (
    <Diagram
      shapes={[
        { name: 'node1', shape: NodeShape }
      ]}
      nodes={[
        { id: '1', x: 100, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 1' },
        { id: '2', x: 300, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 2' },
        { id: '3', x: 500, y: 100, shape: 'node1', width: 100, height: 100, name: 'Node 3' },
      ]}
      links={[
        { id: '1', type: 'BROKEN_ROUNDED', source: '1', sourceDirection: 'BOTTOM', target: '2', targetDirection: 'TOP', name: 'Link 1' },
        { id: '2', type: 'BROKEN_ROUNDED', source: '2', sourceDirection: 'BOTTOM', target: '3', targetDirection: 'TOP', name: 'Link 2' },
      ]}
    />
  );
};

export default App;
```


