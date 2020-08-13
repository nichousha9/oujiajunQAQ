// 节点剩余规则
const processTypeRules = {
  startEvent: {
    pointsAnchor: ['BottomCenter'],
    maxConnections: 1, // 只能连一条
    isTarget: false, // 控制开始只能出不能进
  },
  endEvent: {
    pointsAnchor: ['TopCenter'],
    // maxConnections: 1, // 只能连一条
    isSource: false, // 控制结束只能进不能出
  },
};


// 流程图连接默认样式
const defStyles = {
  paintStyle: {
    stroke: '#BFC4CB',
    fill: '#ffffff',
    radius: 3,
    strokeWidth: 1,
  },
  connectorPaintStyle: {
    strokeWidth: 1,
    stroke: '#858686',
    joinstyle: 'round',
    outlineStroke: 'transparent',
    outlineWidth: 2,
  },
  connectorHoverStyle: {
    strokeWidth: 2,
    stroke: '#1e8151',
    outlineWidth: 5,
    outlineStroke: 'transparent',
  },
  endpointHoverStyle: {
    fill: '#fff',
    stroke: '#1890FF',
  },
};

const JspDefaultOptions = {
  sourceEndpointOpts: {
    endpoint: 'Dot',
    paintStyle: defStyles.paintStyle,
    isSource: true,
    connector: ['Straight'],
    connectorStyle: defStyles.connectorPaintStyle,
    hoverPaintStyle: defStyles.endpointHoverStyle,
    connectorHoverStyle: defStyles.connectorHoverStyle,
    dragOptions: {},
    overlays: [
      [
        'Label',
        {
          location: [0.5, 1.5],
          label: 'Drag',
          cssClass: 'endpointSourceLabel',
          visible: false,
        },
      ],
    ],
  },
  targetEndpointOpts: {
    endpoint: 'Dot',
    paintStyle: defStyles.paintStyle,
    hoverPaintStyle: defStyles.endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: 'dropHover', activeClass: 'dragActive' },
    isTarget: true,
    overlays: [
      [
        'Label',
        { location: [0.5, -0.5], label: 'Drop', cssClass: 'endpointTargetLabel', visible: false },
      ],
    ],
  },
};

export { JspDefaultOptions, processTypeRules, defStyles };
