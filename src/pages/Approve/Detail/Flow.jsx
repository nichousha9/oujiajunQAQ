/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row, message, Card, Button, Popover, Popconfirm } from 'antd';
import router from 'umi/router';
import Jsplumb from 'jsplumb';
import classnames from 'classnames';
import $ from 'jquery';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import { randomWord } from '@/utils/utils';
import { processTypeRules, JspDefaultOptions, defStyles } from './processTypeRules';
import DetailForm from './DetailForm';
import Iconfont from '@/components/Iconfont';
import Ellipsis from '@/components/Ellipsis';

const jsPlumbIn = Jsplumb.jsPlumb;

@connect(({ loading }) => ({
  loading: loading.effects['approveDetail/dealApprovalFlowchart'],
}))
class ApproveDetail extends Component {
  constructor(props) {
    super(props);
    this.clicking_connection = null; // 需要删除的连线
    this.state = {
      processTypes: [], // 流程组件数据
      containerLeft: 0,
      containerTop: 0,
      nodeList: [],
      deleteBoxPosition: {
        left: 0,
        top: 0,
      }, // 右键联线的删除按钮位置
      currentNode: {}, // 当前选中节点或连接的信息
      disabled: props.disabled,
    };
  }

  componentDidMount() {
    this.qryApprovalChannel();
    this.initJsplumb();
    this.initEvent();
  }

  componentDidUpdate(prevProps) {
    const { approveInfo } = this.props;
    const { flowchartContent } = approveInfo;
    if (flowchartContent !== prevProps.approveInfo.flowchartContent) {
      this.dealFlowChartContent();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.bodyClick);
    clearTimeout(this.t);
  }

  // 处理初始流程数据
  dealFlowChartContent = () => {
    const { approveInfo } = this.props;
    const { flowchartContent } = approveInfo;
    if (flowchartContent && flowchartContent !== '{}') {
      const instances = JSON.parse(flowchartContent);
      const nodeData = []; // 节点数据
      const connects = []; // 连线数据
      const nodeList = [];
      instances.forEach(item => {
        if (item.type === 'linkEvent') {
          connects.push(item);
        } else {
          nodeData.push(item);
        }
      });
      nodeData.forEach(item => {
        const {
          id,
          x,
          y,
          type,
          slot = [],
          data: { flowchartId, name, processId },
        } = item;
        const points = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const k in slot) {
          if (Object.prototype.hasOwnProperty.call(slot, k)) {
            points.push({
              id: slot[k],
              dataType: '00',
              anchor: this.getPointAnchor(k),
            });
          }
        }
        const processTypeData = this.getProcessTypeByType(type);
        nodeList.push({
          ...processTypeData,
          id: id || `NANO_${randomWord(false, 40)}`,
          x,
          y,
          type,
          flowchartId,
          name,
          processId,
          points,
        });
      });
      this.setState(
        {
          nodeList,
        },
        () => {
          nodeList.forEach(item => {
            const { id } = item;
            this.initNodeElememt(id, item);
          });
          for (let j = 0; j < connects.length; j += 1) {
            const connectData = connects[j];
            const { hooks, data } = connectData;
            const sourceEndpoint = this.jsPlumbInstance.getEndpoint(hooks.srcSlotId);
            const targetEndpoint = this.jsPlumbInstance.getEndpoint(hooks.targetSlotId);
            const myconn = this.jsPlumbInstance.connect({
              source: sourceEndpoint,
              target: targetEndpoint,
            });
            if (data.lineId && data.routeAttribute != undefined) {
              this.setConnect(myconn, data.routeAttribute, data.lineId);
            }
          }
        },
      );
    }
  };

  /** 根据type获取流程类型，type唯一* */
  getProcessTypeByType = processType => {
    const { processTypes } = this.state;
    let processTypeData = {};
    for (let i = 0; i < processTypes.length; i += 1) {
      const type = processTypes[i].busiType;
      if (processType === type) {
        processTypeData = processTypes[i];
        break;
      }
    }
    return processTypeData;
  };

  // 获取初始数据连点名称
  getPointAnchor = k => {
    let myAnchor = '';
    switch (k) {
      case 'topId':
        myAnchor = 'TopCenter';
        break;
      case 'rightId':
        myAnchor = 'RightMiddle';
        break;
      case 'lowId':
        myAnchor = 'BottomCenter';
        break;
      default:
        myAnchor = 'LeftMiddle';
    }
    return myAnchor;
  };

  // 节点渠道
  qryApprovalChannel = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'approveDetail/qryApprovalChannel',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        const processTypes = this.extendProcessTypeRules(processTypeRules, data);
        this.setState(
          {
            processTypes,
          },
          this.dealFlowChartContent,
        );
      },
    });
  };

  /** 有些规则在js定义，而不是在数据库配置，那么这里需要扩展* */
  extendProcessTypeRules = (rules, allProcessTypes) => {
    const processTypes = [];
    for (let i = 0; i < allProcessTypes.length; i += 1) {
      const { busiType } = allProcessTypes[i];
      processTypes[i] = { ...(rules[busiType] || {}), ...allProcessTypes[i] };
    }
    return processTypes;
  };

  // 初始化全局的jsplumb
  initJsplumb = () => {
    // 创建一个jsPlumb对象
    this.jsPlumbInstance = jsPlumbIn.getInstance({
      Endpoint: ['Dot', { radius: 2 }], // 端点的形状定义
      HoverPaintStyle: { strokeStyle: '#d80f0f', lineWidth: 2 }, // 鼠标经过线段样式
      ConnectionOverlays: [
        [
          'Arrow',
          {
            location: 0.97,
            id: 'arrow',
            length: 6,
            width: 6,
            foldback: 0.8,
          },
        ],
      ], // 默认覆盖附着在每个连接器,如附加箭头，label等
      Container: this.holder,
    });
  };

  // 页面点击事件
  bodyClick = e => {
    // 判断点击的对象是否在白名单内，阻止事件
    const whiteNodeList = ['INPUT', 'LABEL', 'path', 'svg'];
    if (whiteNodeList.includes(e.target.nodeName)) return;
    const { currentNode } = this.state;
    this.hideBoxPosition();
    if (currentNode.type) {
      if (currentNode.type === 'connect') {
        this.resetConnect(currentNode.node);
      }
      this.setState({ currentNode: {} });
    }
  };

  // 隐藏删除框
  hideBoxPosition = () => {
    this.setState({
      showDeleteBoxPosition: false,
    });
  };

  // 初始化jsplumb事件
  initEvent = () => {
    const { disabled } = this.props;
    document.addEventListener('click', e => this.bodyClick(e));
    // 当链接建立前
    this.jsPlumbInstance.bind('beforeDrop', connInfo => {
      if (disabled) {
        message.error(formatMessage({ id: 'approve.detail.viewTip' }));
        return false;
      }
      const { sourceId, targetId } = connInfo;
      const { nodeList } = this.state;
      let sourceIdData = {};
      let targetIdData = {};
      // 查询源节点已连接数
      const sourceLength = this.jsPlumbInstance.select({ source: sourceId }).length;
      // 查询目标节点已连接数
      const targetLength = this.jsPlumbInstance.select({ target: targetId }).length;
      if (sourceLength !== 0 || targetLength !== 0) {
        message.warning('环节只允许一进一出');
        return false;
      }
      nodeList.forEach(item => {
        if (item.id === sourceId) {
          sourceIdData = item;
        }
        if (item.id === targetId) {
          targetIdData = item;
        }
      });
      const { toScope } = sourceIdData;
      // 校验是否能够联系
      if (toScope && toScope.indexOf(targetIdData.name) == -1) {
        message.error(`该节点只能与${toScope}节点相连`);
        return false;
      }
      const connectionLines = this.jsPlumbInstance.getAllConnections();
      let flag = true;
      /* eslint-disable no-plusplus */
      // 重复连接判断
      for (let i = 0; i < connectionLines.length; i++) {
        const connectData = connectionLines[i];
        if (
          connectData.sourceId == connInfo.sourceId &&
          connectData.targetId == connInfo.targetId
        ) {
          message.error(formatMessage({ id: 'approve.detail.repeatTip' }));
          flag = false;
          break;
        }
      }
      return flag;
    });

    // // 建立连接后事件
    this.jsPlumbInstance.bind('connection', () => {
      this.refreshXml();
    });

    // 连线的右键事件
    if (!disabled) {
      this.jsPlumbInstance.bind('contextmenu', (obj, e) => {
        const domData = this.rcmidTree.getBoundingClientRect();
        const { left, top } = domData;
        const { clientX, clientY } = e;
        e.preventDefault();
        e.stopPropagation();
        this.clicking_connection = obj;
        this.setState({
          showDeleteBoxPosition: true,
          deleteBoxPosition: {
            left: `${clientX - left}px`,
            top: `${clientY - top}px`,
          },
        });
      });
    }

    this.jsPlumbInstance.bind('click', (conn, e) => {
      const { currentNode } = this.state;
      e.preventDefault();
      e.stopPropagation();
      if (currentNode.type === 'connect') {
        this.resetConnect(currentNode.node);
      }
      conn.setPaintStyle(defStyles.connectorHoverStyle);
      this.setState({
        currentNode: {
          type: 'connect',
          node: conn,
          processId: conn.getParameter('lineId'),
        },
      });
    });

    // 键盘del键删除节点
    if (!disabled) {
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        // IE
        document.onkeydown = event => {
          if (event.keyCode === 46) {
            this.deleteCurrentNode();
          }
        };
      } else {
        // 非IE
        window.onkeydown = event => {
          if (event.keyCode === 46) {
            this.deleteCurrentNode();
          }
        };
      }
    }
  };

  // 初始化联线端点
  initEndPontEvent = (element, node) => {
    const { points, maxConnections = -1, isSource = true, isTarget = true } = node;
    this.jsPlumbInstance.makeSource(element, {
      filter: '.ep',
      anchor: 'Continuous',
      connector: ['Bezier', { curviness: 20 }],
      maxConnections: 5, // 设置连接点最多可以连接几条线
      onMaxConnections(info, e) {
        e.stopPropagation();
        message.error(`超过最大连接数：${info.maxConnections}`);
      },
    });
    // 目标对象
    this.jsPlumbInstance.makeTarget(element, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      endpoint: ['Rectangle', { width: 1, height: 1 }],
      allowLoopback: true,
    });

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const scope = point.dataType;
      const { anchor } = point;

      const opts = {
        scope, // 这里定义了点到点能互相连的范围，这个很重要
        ...JspDefaultOptions.sourceEndpointOpts,
        ...JspDefaultOptions.targetEndpointOpts,
        maxConnections,
        isSource,
        isTarget,
      };

      const endpoint = this.jsPlumbInstance.addEndpoint(element, opts, {
        anchor,
        uuid: point.id,
      });
      endpoint.setParameter('ftId', point.id);
      endpoint.setParameter('processId', node.processId || '');
    }
  };

  // 编辑状态控制节点可拖动且可连线
  initNodeElememt = (id, node) => {
    const { disabled } = this.props;
    const els = document.getElementById(id);
    if (!disabled) {
      // 同样设置可拖动，该属性可设置false,使节点不可拖动
      this.jsPlumbInstance.draggable(els, {
        revert: false,
        stop: () => {
          this.refreshXml();
        },
      });
    }
    // 添加节点上可拖动线段的端点，四个方向 pointClass是端点的样式，可自行设置
    this.initEndPontEvent(els, node);
  };

  // 右键删除连线事件
  rightDeleteConnection = callback => {
    if (this.clicking_connection) {
      this.jsPlumbInstance.deleteConnection(this.clicking_connection);
      this.setState({
        showDeleteBoxPosition: false,
        currentNode: {},
      });
      this.refreshXml();
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  // 编辑节点
  edit = (item, e) => {
    const { currentNode } = this.state;
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (currentNode.type === 'connect') {
      this.resetConnect(currentNode.node);
    }
    this.setState({ currentNode: item });
  };

  // 流程配置点击只关闭删除按钮块，不关闭配置
  detailBoxClick = e => {
    // 判断点击的对象是否为选择框，是选择框，则阻止事件
    if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'LABEL') return;
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.hideBoxPosition();
  };

  // 发布活动
  publish = () => {
    const { dispatch, approveInfo } = this.props;
    dispatch({
      type: 'approveDetail/dealApprovalFlowchart',
      payload: {
        id: approveInfo.id,
        status: '2000',
      },
      success: () => {
        router.push('/approve');
      },
    });
  };

  // 删除节点(判断是否能删除)
  delNodeOperator = (nodeData, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    this.delNode(nodeData);
  };

  // 删除节点
  delNode = (nodeData, callback) => {
    const { dispatch } = this.props;
    const delNodeInstance = () => {
      let { nodeList } = this.state;
      nodeList = nodeList.filter(item => {
        return item.id !== nodeData.id;
      });
      this.jsPlumbInstance.removeAllEndpoints(nodeData.id);
      this.setState(
        {
          nodeList,
        },
        () => {
          this.refreshXml();
          if (callback) {
            callback();
          }
        },
      );
    };
    if (nodeData.processId) {
      dispatch({
        type: 'approveDetail/delApprovalProcess',
        payload: {
          id: nodeData.processId,
        },
        success: () => {
          delNodeInstance();
        },
      });
    } else {
      delNodeInstance();
    }
  };

  // del键删除当前节点
  deleteCurrentNode = () => {
    const { currentNode } = this.state;
    if (currentNode.type) {
      if (currentNode.type === 'connect') {
        this.clicking_connection = currentNode.node;
        this.rightDeleteConnection(() => {
          this.setState({ currentNode: {} });
        });
      } else {
        this.delNode(currentNode, () => {
          this.setState({ currentNode: {} });
        });
      }
    }
  };

  // 修改nodeData数据
  modifyNodeList = nodeData => {
    const { id } = nodeData;
    const newNodeData = {
      ...nodeData,
    };
    const { nodeList } = this.state;
    this.setState(
      {
        nodeList: nodeList.map(item => {
          if (item.id === id) {
            return newNodeData;
          }
          return item;
        }),
        currentNode: newNodeData,
      },
      () => {
        this.refreshXml();
      },
    );
  };

  // 修改连线数据
  modifyConnect = (value, lineId) => {
    const { currentNode } = this.state;
    const { node } = currentNode;
    this.setConnect(node, value, lineId);
    this.refreshXml();
  };

  // 设置连线颜色文字
  setConnect = (curConn, value, lineId, setParams = true) => {
    if (!curConn) {
      return;
    }
    let color = '';
    let text = '';
    if (value === 'Y') {
      color = '#00C1DE';
      text = formatMessage({ id: 'common.text.yes' });
    } else {
      color = '#FF0000';
      text = formatMessage({ id: 'common.text.no' });
    }
    // 设置连线颜色
    curConn.setPaintStyle({ stroke: color, strokeWidth: 1, fill: 'red' });
    if (setParams) {
      // 连线文字
      curConn.addOverlay([
        'Custom',
        {
          create() {
            return $(`<span style='background-color: white; padding: 5px;'>${text}</span>`);
          },
          location: 0.5, // 文字的位置
        },
      ]); // 节点，有样式
      // 设置连线断点样式
      if (curConn.endpoints && curConn.endpoints.length) {
        curConn.endpoints.forEach(item => {
          item.setStyle({ stroke: color, strokeWidth: 1, fill: '#fff' });
        });
      }
      curConn.setParameter('lineId', lineId);
      curConn.setParameter('routeAttribute', value);
    }
  };

  resetConnect = curConn => {
    const value = curConn.getParameter('routeAttribute');
    const lineId = curConn.getParameter('lineId');
    if (value && lineId) {
      this.setConnect(curConn, value, lineId, false);
    } else {
      curConn.setPaintStyle(defStyles.connectorPaintStyle);
    }
  };

  // 更新连线数据
  refreshXml = () => {
    const { disabled } = this.state;
    if (disabled) return;
    clearTimeout(this.t);
    this.t = setTimeout(() => {
      const content = this.getChartContent();
      this.saveChart(content);
    }, 500);
  };

  // 整理提交流程图格式
  getChartContent = () => {
    const { nodeList, containerLeft, containerTop } = this.state;
    const { approveInfo = {} } = this.props;
    const content = [];
    // 节点数据
    nodeList.forEach(item => {
      const { id, type, processId, name, flowchartId = approveInfo.id, points = [] } = item;
      // 当移动时没有更新nodelist中x,y,所以用样式中数据
      const elementStyle = document.getElementById(id).style;
      const { left, top } = elementStyle;
      const x = Number(left.replace('px', '')) + containerLeft;
      const y = Number(top.replace('px', '')) + containerTop;
      const slot = {};
      points.forEach(endItem => {
        const { anchor } = endItem;
        switch (anchor) {
          case 'TopCenter':
            slot.topId = endItem.id;
            break;
          case 'RightMiddle':
            slot.rightId = endItem.id;
            break;
          case 'BottomCenter':
            slot.lowId = endItem.id;
            break;
          default:
            slot.leftId = endItem.id;
        }
      });
      content.push({
        id,
        type,
        x,
        y,
        data: {
          type,
          name,
          flowchartId,
          processId,
        },
        slot,
      });
    });
    // 连线数据
    const connectionLines = this.jsPlumbInstance.getAllConnections();
    connectionLines.forEach(item => {
      const { id } = item;
      const lineId = item.getParameter('lineId');
      const routeAttribute = item.getParameter('routeAttribute');
      const connection = {
        id,
        type: 'linkEvent',
        data: {
          type: 'linkEvent',
          flowchartId: approveInfo.id,
          lineId,
          routeAttribute,
        },
        hooks: {},
      };
      const { fromCompId, toCompId, srcSlotId, targetSlotId } = this.getConnectFT(item);
      connection.data.fromCompId = fromCompId;
      connection.hooks.srcSlotId = srcSlotId;
      connection.data.toCompId = toCompId;
      connection.hooks.targetSlotId = targetSlotId;
      content.push(connection);
    });
    return content;
  };

  // 获取连线的fromId和toId
  getConnectFT = node => {
    const { endpoints } = node;
    const { nodeList } = this.state;
    let fromCompId = '';
    let toCompId = '';
    let srcSlotId = '';
    let targetSlotId = '';
    for (let j = 0; j < endpoints.length; j += 1) {
      const { elementId } = endpoints[j];
      let processId = endpoints[j].getParameter('processId');
      const ftId = endpoints[j].getParameter('ftId');
      if (!processId) {
        nodeList.forEach(v => {
          if (v.id == elementId) {
            // eslint-disable-next-line prefer-destructuring
            processId = v.processId;
          }
        });
      }
      if (j == 0) {
        fromCompId = processId;
        srcSlotId = ftId;
      } else {
        toCompId = processId;
        targetSlotId = ftId;
      }
    }
    return { fromCompId, toCompId, srcSlotId, targetSlotId };
  };

  // 保存
  saveChart = content => {
    const {
      dispatch,
      approveInfo: { id },
    } = this.props;
    dispatch({
      type: 'approveDetail/modApprovalFlowchartContent',
      payload: {
        id,
        content,
      },
    });
  };

  render() {
    const { loading, disabled, back, approveInfo } = this.props;
    const {
      containerLeft,
      containerTop,
      nodeList,
      showDeleteBoxPosition,
      deleteBoxPosition,
      currentNode,
      processTypes,
    } = this.state;

    return (
      <>
        <div className={styles.title}>{formatMessage({ id: 'approve.detail.userInfo' })}</div>
        <Row type="flex" gutter={20} className={styles.chart} id="chart">
          <Col className={styles.editorElementSidebar}>
            {/* 流程组件 */}
            <Card size="small" title={formatMessage({ id: 'approve.detail.flowComponent' })}>
              <Row gutter={16} className={styles.typeBox}>
                {processTypes.map((item, i) => (
                  <Col span={12} key={`ii${i}`}>
                    <div
                      className={styles.item}
                      draggable={!disabled}
                      onDragStart={event => {
                        const { offsetX, offsetY } = event.nativeEvent;
                        this.elementOffsetX = offsetX;
                        this.elementOffsetY = offsetY;
                        event.dataTransfer.setData('text', JSON.stringify(item));
                      }}
                    >
                      <div className={styles.iconItem} style={{ backgroundColor: item.color }}>
                        <Iconfont type={item.icon} />
                      </div>
                      <div className={styles.name}>{item.name}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col className={styles.editorContent}>
            {/* 属性 */}
            <Card
              size="small"
              title={formatMessage({ id: 'approve.detail.property' })}
              className={styles.flowBox}
            >
              <div
                className={classnames(styles.rcmidTree)}
                onMouseDown={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  const {
                    nativeEvent: { clientX, clientY },
                  } = event;
                  this.boxOffsetX = clientX || 0;
                  this.boxOffsetY = clientY || 0;
                  this.containerLeft = Number(containerLeft);
                  this.containerTop = Number(containerTop);
                  this.down = true;
                }}
                onMouseMove={event => {
                  event.persist();
                  event.stopPropagation();
                  event.preventDefault();
                  if (this.down && event && event.nativeEvent) {
                    $(event.target).css('cursor', 'move');
                    const {
                      nativeEvent: { clientX, clientY },
                    } = event;
                    const addLeft = clientX - this.boxOffsetX;
                    const addTop = clientY - this.boxOffsetY;
                    if ((Math.abs(addLeft) > 1 || Math.abs(addTop) > 1) && !disabled) {
                      this.setState(
                        {
                          containerLeft: addLeft + this.containerLeft,
                          containerTop: addTop + this.containerTop,
                        },
                        this.refreshXml,
                      );
                    }
                  }
                }}
                onMouseUp={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  $(event.target).css('cursor', 'default');
                  this.down = false;
                }}
                onDragOver={event => {
                  event.preventDefault();
                }}
                onDrop={event => {
                  const data = JSON.parse(event.dataTransfer.getData('text'));
                  const {
                    pointsAnchor = ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle'],
                  } = data;
                  const { offsetX, offsetY } = event.nativeEvent;
                  const id = `NANO_${randomWord(false, 40)}`;
                  const points = [];
                  pointsAnchor.forEach(item => {
                    points.push({
                      id: `NANO_${randomWord(false, 40)}`,
                      dataType: '00',
                      anchor: item,
                    });
                  });
                  const node = {
                    ...data,
                    type: data.busiType,
                    x: offsetX - this.elementOffsetX,
                    y: offsetY - this.elementOffsetY,
                    id,
                    points,
                  };
                  this.setState(
                    {
                      nodeList: [...nodeList, node],
                    },
                    () => {
                      this.initNodeElememt(id, node);
                      this.refreshXml();
                    },
                  );
                }}
                ref={v => {
                  this.rcmidTree = v;
                }}
              >
                <ul
                  className={styles.projectBtn}
                  ref={v => {
                    this.holder = v;
                  }}
                  style={{ left: `${containerLeft}px`, top: `${containerTop}px` }}
                >
                  {nodeList.length > 0
                    ? nodeList.map(item => (
                        <Popover
                          content={
                            <Popconfirm
                              title="是否删除?"
                              onConfirm={e => this.delNodeOperator(item, e)}
                              okText="确认"
                              cancelText="取消"
                            >
                              <a className={styles.toolsItem}>
                                <Iconfont type="iconshanchux" />
                                {formatMessage({ id: 'common.btn.delete' })}
                              </a>
                            </Popconfirm>
                          }
                          trigger={!disabled ? 'click' : 'disabled'}
                          arrowPointAtCenter
                          placement="top"
                          key={item.id}
                          autoAdjustOverflow
                          title={null}
                          overlayStyle={{ zIndex: 2 }}
                          overlayClassName={styles.tachePopover}
                          getPopupContainer={() => document.getElementById('chart')}
                        >
                          <li
                            className={classnames(
                              styles.item,
                              currentNode.id === item.id ? styles.active : null,
                            )}
                            style={{ left: `${item.x || 0}px`, top: `${item.y || 0}px` }}
                            id={item.id}
                            onClick={e => {
                              this.edit(item, e);
                            }}
                          >
                            <div
                              className={styles.iconItem}
                              style={{ backgroundColor: item.color }}
                            >
                              <Iconfont type={item.icon} />
                            </div>
                            <div className={styles.name}>
                              <Ellipsis lines={1}>{item.name}</Ellipsis>
                            </div>
                          </li>
                        </Popover>
                      ))
                    : null}

                  {showDeleteBoxPosition && (
                    <div
                      className={styles.deleteBox}
                      style={deleteBoxPosition}
                      onClick={this.rightDeleteConnection}
                    >
                      <div>
                        <Iconfont type="iconshanchux" />
                        <span>{formatMessage({ id: 'common.btn.delete' })}</span>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </Card>
          </Col>
          <Col className={styles.editorSidebar}>
            {/* 流程配置 */}
            <Card
              size="small"
              title={formatMessage({ id: 'approve.detail.flowConfiguration' })}
              className={styles.detailForm}
              onClick={this.detailBoxClick}
            >
              <DetailForm
                disabled={disabled}
                flowchartId={approveInfo.id}
                currentNode={currentNode}
                modifyNodeList={this.modifyNodeList}
                modifyConnect={this.modifyConnect}
                getConnectFT={this.getConnectFT}
              />
            </Card>
          </Col>
        </Row>
        <div className={styles.footer}>
          <Button
            size="small"
            type="primary"
            className="mr16"
            onClick={this.publish}
            disabled={disabled || approveInfo.status !== '1000'}
            loading={loading}
          >
            {formatMessage({ id: 'common.btn.pubLish' })}
          </Button>
          <Button size="small" onClick={back}>
            {formatMessage({ id: 'common.btn.close' })}
          </Button>
        </div>
      </>
    );
  }
}

export default ApproveDetail;
