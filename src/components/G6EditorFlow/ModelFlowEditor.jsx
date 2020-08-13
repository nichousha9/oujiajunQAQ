import React from 'react';
import Editor from '../build/Editor.jsx';
import G6Editor from '@antv/g6-editor';
import Contextmenu from './Contextmenu.jsx';
import Page from './Page.jsx';
import { Button } from 'antd';
import './editor.css';
import './modelFlowEditor.css';

const Flow = G6Editor.Flow;
const flowData = [
    {
        key:'k-means',
        label: 'k 均值聚类',
        color_type: '#1890FF',
        type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
        state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
        // 设置锚点
        anchor: [
            [ 0.5, 0, {
                type: 'input'
            }], // 上面边的中点
            [ 0.5, 1, {
                type: 'output'
            }] // 下边边的中点
        ]
    },
    {
      key:'random-forest',
      label: '随机森林',
      color_type: '#9254DE',
      type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
      state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
      // 设置锚点
      anchor: [
          [ 0.5, 0, {
              type: 'input'
          }],
          [ 0.5, 1, {
              type: 'output'
          }]
      ]
    },
    {
      key:'PS-SMART',
      label: 'PS-SMART 分类',
      color_type: '#1890FF',
      type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
      state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
      // 设置锚点
      anchor: [
          [ 0.5, 0, {
              type: 'input'
          }],
          [ 0.33, 1, {
              type: 'output'
          }],
          [ 0.66, 1, {
              type: 'output'
          }]
      ]
    },
    {
      key:'Bayes',
      label: '朴素贝叶斯',
      color_type: '#9254DE',
      type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
      state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/uZVdwjJGqDooqKLKtvGA.svg',
      // 设置锚点
      anchor: [
          [ 0.5, 0, {
              type: 'input'
          }],
          [ 0.5, 1, {
              type: 'output'
          }]
      ]
    },
    {
      key:'read-data-base',
      label: '读数据表',
      color_type: '#FAAD14',
      type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
      state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
      // 设置锚点
      anchor: [
          [ 0.5, 1, {
              type: 'output'
          }]
      ]
    },
]
// 注册模型卡片基类
Flow.registerNode('model-card', {
  draw(item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const width = 184;
    const height = 40;
    const x = -width / 2;
    const y = -height / 2;
    const borderRadius = 4;
    const keyShape = group.addShape('rect', {
      attrs: {
        x,
        y,
        width,
        height,
        radius: borderRadius,
        fill: 'white',
        stroke: '#CED4D9'
      }
    });
    // 左侧色条
    group.addShape('path', {
      attrs: {
        path: [
          [ 'M', x, y + borderRadius ],
          [ 'L', x, y + height - borderRadius ],
          [ 'A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height ],
          [ 'L', x + borderRadius, y ],
          [ 'A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius ]
        ],
        fill: this.color_type
      }
    });
    // 类型 logo
    group.addShape('image', {
      attrs: {
        img: this.type_icon_url,
        x: x + 16,
        y: y + 12,
        width: 20,
        height: 16
      }
    });
    // 名称文本
    const label = model.label ? model.label : this.label;
    group.addShape('text', {
      attrs: {
        text: label,
        x: x + 52,
        y: y + 13,
        textAlign: 'start',
        textBaseline: 'top',
        fill: 'rgba(0,0,0,0.65)'
      }
    });
    // 状态 logo
    group.addShape('image', {
      attrs: {
        img: this.state_icon_url,
        x: x + 158,
        y: y + 12,
        width: 16,
        height: 16
      }
    });
    return keyShape;
  },
  // 设置锚点
  anchor: [
    [ 0.5, 0 ], // 上面边的中点
    [ 0.5, 1 ] // 下边边的中点
  ]
});
(flowData || []).forEach((item)=>{
    Flow.registerNode(item.key, {
        label: item.label,
        color_type: item.color_type,
        type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
        state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
        // 设置锚点
        anchor: item.anchor,
    }, 'model-card');
})

class ModelFlowEditor extends Editor {
  componentDidMount() {
    setTimeout(() => {
      super.componentDidMount();
      const page = this.page;
        // 获取上一次的数据
        page.read(JSON.parse(window.localStorage.getItem('haha') || '{}'))
      // 输入锚点不可以连出边
      page.on('hoveranchor:beforeaddedge', ev => {
        if (ev.anchor.type === 'input') {
          ev.cancel = true;
        }
      });
      page.on('dragedge:beforeshowanchor', ev => {
        // 只允许目标锚点是输入，源锚点是输出，才能连接
        if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
          ev.cancel = true;
        }
        // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
        if (ev.dragEndPointType === 'target' && page.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
          ev.cancel = true;
        }
        // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
        if (ev.dragEndPointType === 'source' && page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
          ev.cancel = true;
        }
      });
    }, 100);
  }
    savePage = () =>{
      console.log(this.page);
        const data = this.page.save();
       window.localStorage.setItem('haha',JSON.stringify(data || '{}'))
    }
  render() {
    // selectedModel 当前选中的条目
    const { selectedModel } = this.state;

    return <div id="editor">
        <Button onClick={this.savePage}>保存</Button>
      <div className="bottom-container">
        <Contextmenu />
        <div id="itempannel">
            {flowData.map((item)=>{
              return (<li key={item.key} data-shape={item.key} data-size="170*34"data-type="node" className="getItem">
                  <span className="pannel-type-icon"></span>{item.label}
              </li>)
            })}
        </div>
        <Page />
      </div>
    </div>;
  }
}
export default ModelFlowEditor;
