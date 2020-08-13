/* eslint-disable no-shadow */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import React, { Component } from 'react';
import { connect } from 'dva';
import Jsplumb from 'jsplumb';
import { formatMessage } from 'umi-plugin-react/locale';
import { withRouter } from 'dva/router';
import lodash from 'lodash';
// import router from 'umi/router';
import $ from 'jquery';
import classnames from 'classnames';
import { Icon, Row, Col, message, Popover, Modal, Tooltip } from 'antd';
import { randomWord, genUuid } from '@/utils/utils';
import { node } from 'prop-types';
import {
  processTypeRules,
  JspDefaultOptions,
  mccProcessTypeDef,
  floatToolBtns,
} from './processTypeRules'; // 有些规则在js定义，而不是在数据库配置，那么这里需要扩展(旧系统遗留问题，坑)
import Iconfont from '@/components/Iconfont/index';
import styles from './index.less';

import Select from '../Select/index';
import Contact from '../Contact/index';
import ModalCustomner from '../Select/ModalCustomer';
import NextStage from '../NextStage/index';
import Ire from '../Ire/index';
import Segment from '../Segment/index';
import Set from '../Set/index';
import DirectBonus from '../DirectBonus/index';
import Sample from '../Sample/index';
import Listener from '../Listener/index';
import AbDecision from '../AbDecision/index';
import Schedule from '../Schedule/index';
// import { number } from 'prop-types';

const jsPlumbIn = Jsplumb.jsPlumb;
const { confirm } = Modal;

@connect(({ user, activityFlowContact }) => ({
  activityFlowContact,
  userInfo: user.userInfo,
}))
class Chart extends Component {
  constructor(props) {
    super(props);
    this.flowchartContent = null; // 生成的xml数据
    this.clicking_connection = null; // 需要删除的连线
    this.isLock = false; // 流程图是否加锁了
    const {
      campaignInfo: { campaignState = 'Editing' },
      campaignInfo,
      location: { query = {} },
    } = props;

    this.state = {
      campaignInfo,
      readOnly: campaignState !== 'Editing',
      containerLeft: 0,
      containerTop: 0,
      processTypes: [],
      nodeList: [],
      deleteBoxPosition: {
        left: 0,
        top: 0,
      }, // 右键联线的删除按钮位置
      showDeleteBoxPosition: false, // 是否显示右键连线按钮,
      showSelctModal: false, // 显示Select节点弹窗,
      showModalCustomner: false, // 人员清单弹框
      showAppModal: false, // 显示app节点弹窗
      showNextStageModal: false, // 显示NextStage节点弹窗
      showIreModal: false, // 显示IRE节点弹窗
      showSegmentModal: false, // 显示Segment节点弹窗
      showSetModal: false, // 显示SET节点弹窗
      showDirectBonusModal: false, // 显示Direct Bonus节点弹窗
      showSampleModal: false, // 显示Sample节点弹窗
      showListenerModal: false, // 显示Listener节点弹窗
      showAbDecisionModal: false, // 显示Listener节点弹窗
      showScheduleModal: false, // 显示schedule节点弹窗
      nodeData: '', // 点击弹窗的当前节点数据
      prevAllNodeData: '', // 点击弹窗的所有上一个节点的数据
      prevNodeData: '', // 点击弹窗的上一个节点的数据
      nextNodeData: '', // 上一个节点的数据
      scheduleType: '', // 定时器类型（有节点和整个流程）
      hovered: -1, // 触发hover的节点
      clicked: -1, // 触发click的节点
      // isTemp: query.isTemp || 'N', // 是否为模板
      tempType: query.tempType || 'add',
      clickState: 'N',
      wire: false,
    };
  }

  componentDidMount = () => {
    this.qryAllProcessTypes();
    this.initJsplumb();
    this.initEvent();
  };

  componentWillUpdate(nextProps) {
    const { nodeList, clickState } = this.state;
    if (nodeList.length !== 0 && clickState === 'Y') {
      let labelIndex = null;
      for (let i = 0; i < nodeList.length; i += 1) {
        if (nodeList[i].processType === 'SCHEDULE') labelIndex = i;
      }
      const targetObj = JSON.parse(JSON.stringify(nodeList));
      const newtargetObj = JSON.parse(JSON.stringify(targetObj));

      newtargetObj.splice(labelIndex, 1);
      if (newtargetObj.every(v => v.NODE_STATE !== 2 && v.NODE_STATE !== 3)) {
        this.setState({ clickState: 'N' });
        clearTimeout(this.status);
      }
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.hideBoxPosition);
    clearTimeout(this.t);
    clearTimeout(this.status);
    if (this.move) {
      clearTimeout(this.move);
    }
    if (this.lock) {
      clearTimeout(this.lock);
    }
    this.unLockCampaign();
  };

  // 查询流程图
  qryFlowChartContentById = () => {
    const {
      activityInfo: { campaignId },
      dispatch,
    } = this.props;

    const {
      campaignInfo: { campaignState = 'Editing' },
    } = this.state;
    dispatch({
      type: 'activityFlow/qryFlowChartContentById',
      payload: {
        campaignId,
      },
    }).then(res => {
      if (res.svcCont && res.svcCont.data && res.svcCont.data.flowchartContent) {
        this.flowchartContent = res.svcCont.data.flowchartContent;
        if (res.svcCont.data.isLock !== false) {
          // 流程图被锁了
          message.warning('其他用户在编辑该流程图,只能查看~~');
          this.isLock = true;
          const { campaignInfo } = this.state;
          this.setState({
            campaignInfo: {
              ...campaignInfo,
              campaignState: 'Finished',
            },
            readOnly: true,
          });
        } else if (campaignState === 'Editing') {
          // 流程图没有上锁要锁流程图
          this.lockCampaign();
        }
        this.parseXml();
      }
    });
  };

  // 解锁流程图
  unLockCampaign = () => {
    const {
      activityInfo: { flowchartId },
      dispatch,
    } = this.props;
    dispatch({
      type: 'activityFlow/unLockFlowChart',
      payload: {
        flowchartId,
        // campaignId,
        // browserUuId: this.browserUuId,
      },
    });
  };

  lockCampaign = () => {
    const {
      activityInfo: { campaignId, flowchartId },
      dispatch,
    } = this.props;

    if (!this.browserUuId) {
      this.browserUuId = genUuid(6);
    }
    dispatch({
      type: 'activityFlow/lockFlowChart',
      payload: {
        flowchartId,
        campaignId,
        browserUuId: this.browserUuId,
      },
    }).then(() => {
      this.lock = setTimeout(() => {
        this.lockCampaign();
      }, 5000);
    });
  };

  arrTest = (arr, key) => {
    const obj = {};
    for (let i = 0; i < arr.length; i += 1) {
      if (obj[arr[i][key]]) {
        return { obj: arr[i], state: true };
      }
      obj[arr[i][key]] = arr[i];
    }
    return { obj, state: false };
  };

  // 初始化全局的jsplumb
  initJsplumb = () => {
    this.jsPlumbInstance = jsPlumbIn.getInstance({
      Endpoint: ['Dot', { radius: 2 }],
      HoverPaintStyle: { strokeStyle: '#1e8151', lineWidth: 2 },
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
      ],
      Container: this.holder,
    });
  };

  hideBoxPosition = () => {
    this.setState({
      showDeleteBoxPosition: false,
    });
  };

  // 初始化jsplumb事件
  initEvent = () => {
    const { wire } = this.state;
    document.addEventListener('click', this.hideBoxPosition);
    // 当链接建立前
    this.jsPlumbInstance.bind('beforeDrop', connInfo => {
      const { sourceId, targetId } = connInfo;
      const { nodeList } = this.state;
      let sourceIdData = {};
      let targetIdData = {};
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
      if (toScope && toScope.indexOf(targetIdData.processType) == -1) {
        message.info(`该节点只能与${toScope}节点相连`);
        return false;
      }
      const connectionLines = this.jsPlumbInstance.getAllConnections();

      let flag = true;
      for (let i = 0; i < connectionLines.length; i += 1) {
        const connectData = connectionLines[i];
        if (
          connectData.sourceId == connInfo.sourceId &&
          connectData.targetId == connInfo.targetId
        ) {
          message.info(`请勿重复链接`);
          flag = false;
          break;
        }
      }
      return flag;
    });

    // 建立连接后事件
    this.jsPlumbInstance.bind('connection', () => {
      this.refreshXml();
    });

    // 连线的右键事件
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
    this.setState({ wire: !true });
  };

  // 查询所有的节点类型
  qryAllProcessTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlow/qryAllProcessTypes',
      payload: {},
    }).then(res => {
      if (res && res.svcCont && res.svcCont.data && res.svcCont.data.length > 0) {
        this.extendProcessTypeRules(processTypeRules, res.svcCont.data);
      }
    });
  };

  /** 有些规则在js定义，而不是在数据库配置，那么这里需要扩展(旧系统遗留问题)* */
  /* eslint-disable no-plusplus */
  extendProcessTypeRules = (rules, allProcessTypes) => {
    for (let i = 0; i < allProcessTypes.length; i++) {
      const group = allProcessTypes[i];
      const list = group.mccProcessTypes;
      for (let j = 0; j < list.length; j++) {
        const type = list[j];
        for (let k = 0; k < rules.length; k++) {
          const rule = rules[k];
          if (rule.processType == type.processType) {
            lodash.assignIn(type, rule);
          }
        }
      }
    }
    this.setState(
      {
        processTypes: allProcessTypes,
      },
      () => {
        this.qryFlowChartContentById();
      },
    );
  };

  changeSlide = (item, index) => {
    const { hideItem = false } = item;
    const { processTypes } = this.state;
    processTypes.splice(index, 1, { ...item, hideItem: !hideItem });
    this.setState({
      processTypes,
    });
  };

  // 初始化联线端点
  initEndPontEvent = (element, node) => {
    const { points } = node;
    this.jsPlumbInstance.makeSource(element, {
      filter: '.ep',
      anchor: 'Continuous',
      connector: ['Bezier', { curviness: 20 }],
      maxConnections: 5,
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

      const opts = Object.assign(
        {},
        {
          scope, // 这里定义了点到点能互相连的范围，这个很重要
        },
        JspDefaultOptions.sourceEndpointOpts,
        JspDefaultOptions.targetEndpointOpts,
      );
      const endpoint = this.jsPlumbInstance.addEndpoint(element, opts, {
        anchor,
        uuid: point.id,
      });
      endpoint.setParameter('processname', node.processname);
      endpoint.setParameter('name', point.id);
      endpoint.setParameter('processId', node.PROCESS_ID || '');
    }
  };

  renderTachePopover = node => {
    const { campaignInfo } = this.state;
    const { popBtns } = node;
    const { campaignState = 'Editing' } = campaignInfo;
    let btns = ['editNode'];
    if ('/Editing/To Editing/'.indexOf(`/${campaignState}/`) !== -1 && popBtns && popBtns.edit) {
      btns = popBtns.edit.split(',');
    } else if (
      '/Publish/Resume/Suspend/Published/Approvaling/'.indexOf(`/${campaignState}/`) !== -1 &&
      popBtns &&
      popBtns.release
    ) {
      btns = popBtns.release.split(',');
    } else if ('/Approvaling/'.indexOf(`/${campaignState}/`) !== -1 && popBtns && popBtns.review) {
      btns = popBtns.review.split(',');
    }
    // 审核中，终止状态不展示操作按钮
    if (['Termination', 'Approvaling'].includes(campaignState)) {
      btns = [];
    }

    return (
      <ul className={classnames(styles.floatToolBtnsBox, styles.node)}>
        {btns.indexOf('optmNode') > -1 ? (
          <Tooltip title="节点优化" placement="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li className={styles.toolsItem} onClick={() => this.optimizeNode(node)}>
              <Iconfont type="iconiconx1" />
            </li>
          </Tooltip>
        ) : null}

        {btns.indexOf('editNode') > -1 ? (
          <Tooltip title="节点编辑" placement="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li className={styles.toolsItem} onClick={() => this.edit(node)}>
              <Iconfont type="iconeditx" />
            </li>
          </Tooltip>
        ) : null}
        {btns.indexOf('testNode') > -1 ? (
          <Tooltip title="节点测试" placement="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li className={styles.toolsItem} onClick={() => this.testNodeGlobal(node)}>
              <Iconfont type="icontest" />
            </li>
          </Tooltip>
        ) : null}
        {btns.indexOf('delNode') > -1 ? (
          <Tooltip title="节点删除" placement="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li className={styles.toolsItem} onClick={() => this.delNodeOperator(node)}>
              <Iconfont type="iconshanchux" />
            </li>
          </Tooltip>
        ) : null}
        {btns.indexOf('listNode') > -1 ? (
          <Tooltip title="人员清单" placement="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li className={styles.toolsItem} onClick={() => this.getlistNode(node)}>
              <Iconfont type="iconpeizhi" />
            </li>
          </Tooltip>
        ) : null}
      </ul>
    );
  };

  getlistNode = nodeData => {
    if (!nodeData || !nodeData.PROCESS_ID) {
      message.warning('请先配置节点数据');
      return;
    }
    this.setState({
      showModalCustomner: true, // 人员清单弹框
      nodeData, // 点击弹窗的当前节点数据
    });
  };

  // 右键删除连线事件
  rightDeleteConnection = (connection = '') => {
    const connections = connection === '' ? this.clicking_connection : connection;
    if (connections) {
      this.jsPlumbInstance.deleteConnection(connections);
      this.setState({
        showDeleteBoxPosition: false,
      });
      this.refreshXml();
    }
  };

  // 返回节点的xml数据
  getTacheInstanceXml = () => {
    let xml = '';
    const { nodeList } = this.state;
    const {
      activityInfo: { campaignId, id: flowChartId },
    } = this.props;
    nodeList.forEach(item => {
      const {
        id,
        type,
        processType,
        NODE_STATE,
        RESULT_VALUE,
        processname,
        HAS_RUN,
        channelcode,
        ERROR_MSG,
        PROCESS_ID,
      } = item;
      const elementStyle = document.getElementById(id).style;
      const { left, top } = elementStyle;
      const json = {
        cms: {
          id,
          nodeType: processType,
          data: {
            RESULT_VALUE,
            PROCESS_NAME: processname,
            NODE_STATE,
            HAS_RUN,
            CAMPAIGN_ID: campaignId,
            PROCESS_TYPE: processType,
            channelcode,
            FLOWCHART_ID: flowChartId,
            ERROR_MSG,
            PROCESS_ID: String(PROCESS_ID),
          },
        },
        row: '0',
        col: '0',
      };
      let slots = '';
      const endPoints = this.jsPlumbInstance.getEndpoints(id);
      endPoints.forEach(endpoint => {
        const uuid = endpoint.getUuid();
        slots += `<s><id>${uuid}</id></s>`;
      });
      xml += `<instance id='${id}' type='${type}' name=''>
              <graph>
                <x>${left.replace('px', '')}</x>
                <y>${top.replace('px', '')}</y>
                <width>184</width>
                <height>60</height>
                <json>${JSON.stringify(json)}</json>
                <slot>${slots}</slot>
              </graph>
            </instance>`;
    });
    return xml;
  };

  // 返回连线的xml数据
  getConnectInstanceXml = () => {
    let xml = '';
    const connections = this.getConnections();
    connections.forEach(item => {
      const type = 'com.ztesoft.common.link.JVisioLink';
      const { id } = item;
      const json = {
        toCompId: item.to_op,
        fromCompId: item.from_op,
        nodeType: 'JVisioLlink',
      };
      xml += `<instance id='${id}' sourceRef='${item.from_op}' targetRef='${
        item.to_op
      }' type='${type}' name=''>
              <graph>
                <json>${JSON.stringify(json)}</json>
                <strokeColor></strokeColor>
                <useVisio>false</useVisio>
                <useArrow>true</useArrow>
                <arrowType>0</arrowType>
                <lineType>0</lineType>
                <hooks>
                  <srcHookId></srcHookId>
                  <targetHookId></targetHookId>
                  <srcSlotId>${item.from_port}</srcSlotId>
                  <targetSlotId>${item.to_port}</targetSlotId>
                </hooks>
              </graph>
            </instance>`;
    });
    return xml;
  };

  // 获取连线数据
  getConnections = () => {
    const { nodeList = [] } = this.state;
    const connections = [];
    const connectionLines = this.jsPlumbInstance.getAllConnections();
    connectionLines.forEach(item => {
      const { endpoints, id } = item;
      const connection = {
        id,
      };
      for (let j = 0; j < endpoints.length; j++) {
        const processname = endpoints[j].getParameter('processname');
        const portName = endpoints[j].getParameter('name');
        let processId = endpoints[j].getParameter('processId');
        if (!processId) {
          const { elementId } = endpoints[j];
          nodeList.forEach(v => {
            if (v.id == elementId) {
              processId = v.PROCESS_ID;
            }
          });
        }
        if (j == 0) {
          connection.from_op = processname;
          connection.from_port = portName;
          connection.from = processId;
        } else {
          connection.to_op = processname;
          connection.to_port = portName;
          connection.to = processId;
        }
      }
      connections.push(connection);
    });

    return connections;
  };

  // 获取xml数据的剩余部分
  getXml = xml => {
    const { containerLeft, containerTop } = this.state;
    return `<instance id='NANO_AFAA551B60D419D65EF11AC4A7C60C0DB6D80ADC' type='com.ztesoft.common.JPage' left='${containerLeft}' top='${containerTop}'>
              <graph>
                <children>
                ${xml}
                </children>
                <json>{}</json>
              </graph>
             </instance>`;
  };

  // 解析xml报文，转换成js对象的结构数据
  parseXml = () => {
    const that = this;
    const rootInst = $(that.flowchartContent);
    const left = $(that.flowchartContent).attr('left');
    const top = $(that.flowchartContent).attr('top');
    this.setState({
      containerLeft: left || 0,
      containerTop: top || 0,
    });
    const insts = rootInst.find('graph').find('children');
    const instances = [];
    insts.find('instance').each(function() {
      const map = {};
      const attrs = this.attributes;
      /* eslint-disable guard-for-in,no-restricted-syntax  */
      for (const a in attrs) {
        const attr = attrs[a];
        const { name } = attr;
        const { value } = attr;
        if (name && value) {
          map[name] = value;
        }
      }

      // 2 再获取算子的参数属性
      const graph = that.getXmlParameters($(this).children('graph'));

      instances.push({
        ...graph,
        ...map,
      });
    });
    this.loadContainerFromXml(instances);
    return instances;
  };

  // 设置nodeList数据
  loadContainerFromXml = instances => {
    const nodeData = []; // 节点数据
    const connects = []; // 连线数据
    instances.forEach(item => {
      const { json } = item;
      if (json && json.nodeType && json.nodeType == 'JVisioLlink') {
        connects.push(item);
      } else {
        nodeData.push(item);
      }
    });
    const nodeList = [];
    nodeData.forEach(item => {
      const {
        id,
        x,
        y,
        slot = [],
        json: {
          cms: {
            data: {
              RESULT_VALUE,
              PROCESS_NAME,
              NODE_STATE,
              HAS_RUN,
              PROCESS_TYPE,
              channelcode,
              ERROR_MSG,
              PROCESS_ID,
            },
          },
        },
      } = item;
      const points = slot.map((v, i) => {
        const pointId = v.value.id;
        /* eslint-disable no-nested-ternary */
        return {
          id: pointId,
          dataType: '00',
          anchor:
            i == 0 ? 'TopCenter' : i == 1 ? 'RightMiddle' : i == 2 ? 'BottomCenter' : 'LeftMiddle',
        };
      });
      const processTypeData = this.getProcessTypeByType(PROCESS_TYPE, channelcode);
      nodeList.push({
        ...processTypeData,
        id,
        x,
        y,
        RESULT_VALUE,
        processname: PROCESS_NAME,
        NODE_STATE,
        HAS_RUN,
        processType: PROCESS_TYPE,
        channelcode,
        ERROR_MSG,
        PROCESS_ID: Number(PROCESS_ID),
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
        for (let j = 0; j < connects.length; j++) {
          const connectData = connects[j];
          const { hooks } = connectData;
          const sourceEndpoint = this.jsPlumbInstance.getEndpoint(hooks.srcslotid);
          const targetEndpoint = this.jsPlumbInstance.getEndpoint(hooks.targetslotid);
          this.jsPlumbInstance.connect({
            source: sourceEndpoint,
            target: targetEndpoint,
          });
        }
        this.refreshProcessRunStatus();
      },
    );
  };

  // 刷新流程任务状态
  refreshProcessRunStatus = () => {
    const {
      activityInfo: { flowchartId },
      dispatch,
    } = this.props;
    const { clickState } = this.state;

    dispatch({
      type: 'activityFlow/getFlowChartProcessState',
      payload: {
        flowchartId,
      },
    }).then(res => {
      if (res.topCont && res.topCont.resultCode === 0) {
        const {
          svcCont: { data },
        } = res;
        let { nodeList } = this.state;
        data.forEach((item = {}) => {
          /* eslint-disable camelcase */
          const { processId, state, processType, num } = item;
          if (processId) {
            nodeList = nodeList.map(v => {
              if (v.PROCESS_ID === processId) {
                return {
                  ...v,
                  NODE_STATE: state,
                  RESULT_VALUE: num,
                };
              }
              return v;
            });
          }
        });
        this.setState({
          nodeList,
        });
        /**
         *  1、编辑状态：INACTIVE
         2、审核状态：
         3、查看状态：RUNNING、DELETED(只有RUNNING才需要定时刷新)
         4、终止状态：
         5、发布状态：
         */
        // 流程图是运行状态或者节点处于运行状态
        if (clickState === 'Y' || data.some(v => v.state === 3)) {
          this.status = setTimeout(() => {
            this.refreshProcessRunStatus();
          }, 2500);
        }
      }
    });
  };

  /** 根据process_type获取流程类型，process_type唯一* */
  getProcessTypeByType = (processType, channelcode) => {
    const { processTypes } = this.state;
    let processTypeData = {};
    for (let i = 0; i < processTypes.length; i++) {
      const group = processTypes[i];
      const list = group.mccProcessTypes;
      for (let j = 0; j < list.length; j++) {
        const type = list[j];
        if (
          processType == 'CONTACT' &&
          channelcode != null &&
          type.channelcode != undefined &&
          type.channelcode != '' &&
          type.channelcode != null
        ) {
          if (channelcode == type.channelcode) {
            processTypeData = type;
            return processTypeData;
          }
        } else if (processType == type.processType) {
          processTypeData = type;
          return processTypeData;
        }
      }
    }
    return processTypeData;
  };

  // 获取节点属性
  getXmlParameters = jq => {
    const me = this;
    const parameters = {};
    jq.children().each(function() {
      const key = $(this)[0].localName;
      let value = $(this).text();
      if (key && value) {
        if (key == 'json') {
          value = JSON.parse(value);
        } else if (key == 'hooks') {
          value = me.getXmlParameters($(this));
        } else if (key == 'slot') {
          value = me.getSlotParameters($(this));
        }
        parameters[key] = value;
      }
    });
    return parameters;
  };

  // 获取4个端点数据
  getSlotParameters = jq => {
    const me = this;
    const parameters = [];
    jq.children('s').each(function() {
      const key = $(this)[0].localName;
      const value = me.getXmlParameters($(this));
      if (key && value) {
        const one = {};
        one.key = key;
        one.value = value;
        parameters.push(one);
      }
    });
    return parameters;
  };

  refreshXml = () => {
    const { readOnly } = this.state;

    const connection = this.jsPlumbInstance.getAllConnections();

    const conn = this.arrTest(connection, 'sourceId');
    if (conn.state !== false) {
      message.info('一个SELECT只能匹配一个APP节点');
      this.rightDeleteConnection(conn.obj);
    }

    if (readOnly) return;
    clearTimeout(this.t);
    this.t = setTimeout(() => {
      const instanceXml = this.getTacheInstanceXml();
      const connectXml = this.getConnectInstanceXml();
      const xml = instanceXml + connectXml;
      const content = this.getXml(xml);
      this.saveChart(content);
    }, 500);
  };

  // 保存
  saveChart = content => {
    const connections1 = this.jsPlumbInstance.getAllConnections();
    // const conn = this.arrTest(connections1, 'targetId');
    this.flowchartContent = content;
    const connections = this.getConnections();
    const {
      activityInfo: { flowchartId },
      dispatch,
      userInfo,
    } = this.props;
    const obj = {
      flowChartId: flowchartId,
      flowchartContent: content,
      updateby: userInfo.staffInfo.staffId,
    };
    dispatch({
      type: 'activityFlow/updateFlowChartContent',
      payload: {
        ...obj,
        lines: connections.filter(item => {
          return item.from != undefined && item.to != undefined && item.from != '' && item.to != '';
        }),
      },
    }).then(res => {
      if (
        res &&
        res.topCont &&
        res.topCont.resultCode == -1 &&
        res &&
        res.svcCont &&
        res.svcCont.data &&
        res.svcCont.data
      ) {
        message.error(
          formatMessage({
            id: `activityConfigManage.FLOWCHART_COMMON.${res.svcCont.data
              .replace(/-/g, '_')
              .replace(/\[/g, '')
              .replace(/\]/g, '')
              .replace(/\s/, '')}`,
          }),
        );
      } else if (res && res.topCont && res.topCont.resultCode != 0) {
        message.error(res.topCont.remark);
      }
    });
  };

  initNodeElememt = (id, node) => {
    const els = document.getElementById(id);
    this.jsPlumbInstance.draggable(els, {
      revert: false,
      stop: () => {
        this.refreshXml();
      },
    });
    this.initEndPontEvent(els, node);
  };

  // 删除节点(判断是否能删除)
  delNodeOperator = nodeData => {
    /**
     * 如果检测到节点下面连接了其它节点，禁止删除； 直到节点下面的子节点全部删除完之后才能删除；
     * Schedule节点可以直接删除，不受以上条件约束；
     */
    // const { dispatch } = this.props;
    if (nodeData.processType != mccProcessTypeDef.PROCESS_TYPE.SCHEDULE) {
      const nodeDataIds = this.getPrevOrNextNodeData(nodeData, 'next');
      if (nodeDataIds && nodeDataIds.length > 0) {
        message.warning('无法删除的过程，因为它包含子过程~');
        return;
      }
    }
    this.delNode(nodeData);
  };

  // 删除节点
  delNode = nodeData => {
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
        },
      );
    };
    if (nodeData.PROCESS_ID) {
      dispatch({
        type: 'activityFlow/delProcess',
        payload: {
          processId: nodeData.PROCESS_ID,
          processType: nodeData.processType,
          // CHANNEL_CODE: nodeData.channelcode,
        },
      }).then(res => {
        if (res && res.topCont.resultCode == '0') {
          delNodeInstance();
        } else {
          message.error(res.topCont.remark);
        }
      });
    } else {
      delNodeInstance();
    }
  };

  // 运行节点(判断是否能运行)
  runNode = nodeData => {
    const { dispatch } = this.props;
    if (!nodeData.PROCESS_ID) {
      message.warning('请先配置节点数据');
      return;
    }
    // 查询活动周期
    dispatch({
      type: 'activityFlow/checkInCampCyclePeriod',
      payload: {
        PROCESS_ID: nodeData.PROCESS_ID,
        PROCESS_TYPE: nodeData.processType,
      },
    }).then(res => {
      if (res && res.svcCont && res.svcCont.data && res.svcCont.data.NEED_CONFIRM) {
        if (res.svcCont.data.NEED_CONFIRM == 'Y') {
          this.runProcessNode(nodeData);
        } else {
          message.waring('活动已过期');
        }
      } else {
        message.error('检查周期失败，请检查服务配置~');
      }
    });
  };

  // 修改nodeData数据
  modifyNodeList = nodeData => {
    const { id } = nodeData;
    const elementStyle = document.getElementById(id).style;
    const { left, top } = elementStyle;
    const newNodeData = {
      ...nodeData,
      x: left.replace('px', ''),
      y: top.replace('px', ''),
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
      },
      () => {
        this.refreshXml();
      },
    );
  };

  // 获取上一个节点或下一节点数据,pre为上，next为下
  getPrevOrNextNodeData = (node, type = 'pre') => {
    // const { id } = node;
    const id = node.id ? node.id : node;
    const connectionLines = this.jsPlumbInstance.getConnections(
      type === 'pre' ? { target: id, scope: '*' } : { source: id, scope: '*' },
      true,
    );
    const nodeDataIds = [];
    connectionLines.forEach(item => {
      if (type === 'pre') {
        nodeDataIds.push(item.sourceId);
      } else {
        nodeDataIds.push(item.targetId);
      }
    });
    return nodeDataIds;
  };

  onCancel = () => {
    const { dispatch } = this.props;
    this.setState({
      showSelctModal: false,
      showAppModal: false,
      showScheduleModal: false,
      showModalCustomner: false,
      showNextStageModal: false,
      showIreModal: false,
      showSegmentModal: false,
      showSetModal: false,
      showDirectBonusModal: false,
      showSampleModal: false,
      showListenerModal: false,
      showAbDecisionModal: false,
    });
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        offerRels: [],
        creativeInfoRels: [],
      },
    });
  };

  onOk = nodeData => {
    // 当节点为Email  进行修改后  数量要重置为0
    const newNodeData = nodeData;
    if (nodeData.channelcode === 'EMAIL_CONTACT') {
      newNodeData.RESULT_VALUE = 0;
    }
    this.modifyNodeList(newNodeData);
  };

  getPrevOrNextAllNodeData = (nodeData, type) => {
    let list = [];
    const getAllData = (data, ty) => {
      const arr = this.getPrevOrNextNodeData(data, ty);
      if (arr && arr.length > 0) {
        list = [...list, ...arr];
        arr.forEach(item => {
          getAllData(item, ty);
        });
      }
    };
    getAllData(nodeData, type);
    return list;
  };

  edit = async nodeData => {
    const { tempType } = this.state;
    if (tempType === 'edit' && nodeData.processType === 'SCHEDULE') {
      message.error('任务模板无法编辑定时任务');
    } else {
      const {
        campaignInfo: { campaignState },
      } = this.state;
      let type = 'showSelctModal';
      let tableCode = '';
      const { processType, PROCESS_ID } = nodeData;
      let tempProcessId = PROCESS_ID;
      let actionType = 'M'; // A为新增，V是只能查看，M为可修改
      if (!PROCESS_ID) {
        //  tempProcessId = await this.getSeqWithProcess();
        actionType = 'A';
      } else if (campaignState != 'Editing' && PROCESS_ID) {
        tempProcessId = PROCESS_ID;
        actionType = 'V';
      }

      switch (processType) {
        case 'CONTACT':
          type = 'showAppModal';
          break;
        case 'APP':
          type = 'showAppModal';
          break;
        case 'SELECT':
          type = 'showSelctModal';
          break;
        case 'NEXT_STAGE':
          type = 'showNextStageModal';
          break;
        case 'IRE':
          type = 'showIreModal';
          break;
        case 'SEGMENT':
          type = 'showSegmentModal';
          break;
        case 'SET':
          type = 'showSetModal';
          break;
        case 'DIRECT_BONUS':
          type = 'showDirectBonusModal';
          break;
        case 'SAMPLE':
          type = 'showSampleModal';
          break;
        case 'LISTENER':
          type = 'showListenerModal';
          break;
        case 'AB_DECISION':
          type = 'showAbDecisionModal';
          break;
        case 'SCHEDULE':
          type = 'showScheduleModal';
          break;
        default:
          type = 'showSelctModal';
      }
      const { nodeList } = this.state;
      if (
        mccProcessTypeDef.PROCESS_TYPE.SELECT == processType ||
        mccProcessTypeDef.PROCESS_TYPE.CLOUD == processType ||
        mccProcessTypeDef.PROCESS_TYPE.SEGMENT == processType
      ) {
        tableCode = `MCC_X_${processType}_${tempProcessId}`;
      }
      const preAllNodeDataIds = this.getPrevOrNextAllNodeData(nodeData, 'pre');
      const preNodeDataIds = this.getPrevOrNextNodeData(nodeData, 'pre');
      const nextNodeDataIds = this.getPrevOrNextNodeData(nodeData, 'next');
      const { prevNodeData: prevAllNodeData } = this.controlPrevNodeData(
        preAllNodeDataIds,
      ).prevNodeData;
      const { prevNodeData, prevNodes } = this.controlPrevNodeData(preNodeDataIds);
      const nextNodeData = nextNodeDataIds.map(item => {
        let obj = {};
        nodeList.forEach(v => {
          if (v.id === item) {
            obj = v;
          }
        });
        return obj;
      });

      this.setState({
        [type]: true,
        nodeData: {
          ...nodeData,
          tempProcessId,
          actionType,
          tableCode,
          preTableCode: prevNodes.substring(1, prevNodes.length),
        },
        prevAllNodeData,
        prevNodeData,
        nextNodeData,
        scheduleType: 'PROCESS',
      });
    }
  };

  // 处理上层节点
  controlPrevNodeData = preNodeDataIds => {
    const { nodeList } = this.state;
    let prevNodes = '';
    const prevNodeData = preNodeDataIds.map(item => {
      let obj = {};
      nodeList.forEach(v => {
        if (v.id === item) {
          obj = v;
        }
      });
      return obj;
    });
    prevNodeData.forEach(async item => {
      const { processType: preProcessType, PROCESS_ID: preProcessId } = item;
      if (
        item.PROCESS_ID &&
        (mccProcessTypeDef.PROCESS_TYPE.SELECT == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.PATTERN == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.SEGMENT == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.AGGREGATE == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.CROSS == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.EXCLUDE == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.GENSEGMENT == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.SNAPSHOT == preProcessType)
      ) {
        let smartTableCode = '';
        if (
          mccProcessTypeDef.PROCESS_TYPE.SEGMENT == preProcessType ||
          mccProcessTypeDef.PROCESS_TYPE.SAMPLE == preProcessType
        ) {
          const res = await this.getSmartTableCode(preProcessId, preProcessType);
          if (res && res.svcCont && res.svcCont.data && res.svcCont.data.SMART_TABLE_CODE) {
            smartTableCode = res.svcCont.data.SMART_TABLE_CODE.replace(/,/g, ';');
          }
        } else if (item.PROCESS_ID) {
          smartTableCode = `MCC_X_${preProcessType}_${preProcessId}`;
        }
        prevNodes = `${prevNodes};${smartTableCode}`;
      }
    });
    return { prevNodeData, prevNodes };
  };

  // 节点优化
  optimizeNode = nodeData => {
    const { dispatch, userInfo } = this.props;
    if (!nodeData || !nodeData.PROCESS_ID) {
      message.warning('请先配置该节点数据');
      return;
    }
    dispatch({
      type: 'activityFlow/checkProcessCanOptimize',
      payload: {
        PROCESS_ID: nodeData.PROCESS_ID,
      },
    }).then(result => {
      if (result && result.topCont.resultCode == '0' && result.svcCont.data) {
        confirm({
          content: '确定优化该节点吗？',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            dispatch({
              type: 'activityFlow/optimizeProcess',
              payload: {
                processId: nodeData.PROCESS_ID,
                runByUser: userInfo.userInfo.userId,
                optimizeBatchCode: userInfo.userInfo.userId,
                CHANNEL_CODE: nodeData.channelcode,
                PROCESS_TYPE: nodeData.processType,
              },
            }).then(res => {
              if (res && res.topCont.resultCode == '0') {
                message.success('节点优化成功');
                this.modifyNodeList({
                  ...nodeData,
                  NODE_STATE: '4',
                  NODE_NUM: res && res.svcCont.data ? res.svcCont.data.resultNum : 0,
                });
              } else if (result && result.topCont.resultCode != '-1') {
                message.warning(
                  formatMessage({
                    id: `activityConfigManage.FLOWCHART_COMMON.${result.topCont.resultCode.replace(
                      /-/g,
                      '_',
                    )}`,
                  }),
                );
              }
            });
          },
        });
      } else if (result && result.topCont.resultCode != '-1') {
        message.warning(
          formatMessage({
            id: `activityConfigManage.FLOWCHART_COMMON.${result.topCont.resultCode.replace(
              /-/g,
              '_',
            )}`,
          }),
        );
      } else {
        message.warning('该节点不能优化~~');
      }
    });
  };

  // 节点测试
  testNodeGlobal = async nodeData => {
    if (!nodeData || !nodeData.PROCESS_ID) {
      message.error('请先配置节点数据');
      return;
    }
    const { PROCESS_ID, processType } = nodeData;
    if (!(await this.checkTestContactSeg(nodeData))) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlow/qryBatchByProcessId',
      payload: { processId: PROCESS_ID, BATCH_STATE: 'R', IS_TEST: 'Y' },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (
          res &&
          res.svcCont &&
          res.svcCont.data &&
          res.svcCont.data.length > 0 &&
          processType != 'LISTENER'
        ) {
          message.warning('该节点正在测试中~~');
        } else {
          confirm({
            content: '确定测试该节点吗？',
            cancelText: '取消',
            okText: '确定',
            onOk: () => {
              this.testProcess(nodeData);
            },
          });
        }
      } else {
        message.warning('该节点正在测试中~~');
      }
    });
  };

  testProcess = async nodeData => {
    const { PROCESS_ID, processType, channelcode } = nodeData;
    const {
      activityInfo: { campaignId, id, name },
      dispatch,
    } = this.props;
    const list = [];
    const result = await dispatch({
      type: 'activityFlow/qryMccTestContactSeg',
      payload: { processId: PROCESS_ID },
    });
    if (result && result.svcCont && result.svcCont.data && result.svcCont.data.length > 0) {
      const testContactSeg = result.svcCont.data[0];
      list.push({
        PROCESSING_CELL_ID: testContactSeg.processingCellId,
        COUNT: testContactSeg.segmentcount,
      });
    }
    const res = await dispatch({
      type: 'activityFlow/testProcess',
      payload: {
        processId: PROCESS_ID,
        CHECKED_CELL_LIST: list,
        FLOWCHART_ID: id,
        CAMPAIGN_ID: campaignId,
        CHANNEL_CODE: channelcode,
        FLOWCHART_NAME: name,
        PROCESS_TYPE: processType,
      },
    });
    if (res && res.topCont.resultCode == '0') {
      message.success('节点测试成功');
      this.modifyNodeList({
        ...nodeData,
        NODE_STATE: '4',
        NODE_NUM: res.svcCont.data.resultNum,
      });
    } else {
      message.error('节点测试失败~~');
    }
  };

  /*
   * test 节点，校验test contact seg
   */
  checkTestContactSeg = async nodeData => {
    const { PROCESS_ID, processType } = nodeData;
    const { dispatch } = this.props;
    if (processType == 'LISTENER') {
      const result = await dispatch({
        type: 'activityFlow/qryMccListener',
        payload: { processId: PROCESS_ID },
      });
      if (
        result &&
        result.svcCont &&
        result.svcCont.data &&
        result.svcCont.data.length > 0 &&
        result.svcCont.data[0].AS_REPLY &&
        result.svcCont.data[0].AS_REPLY == 'Y'
      ) {
        return true;
      }
      message.warning('该节点不允许测试');
      return false;
    }
    if (processType == 'DIRECT_BONUS') {
      const result = await dispatch({
        type: 'activityFlow/checkIsAllAudience',
        payload: { processId: PROCESS_ID },
      });
      if (
        result &&
        result.svcCont &&
        result.svcCont.data &&
        result.svcCont.data.IS_ALL_AUDIENCE &&
        result.svcCont.data.IS_ALL_AUDIENCE == 'Y'
      ) {
        return true;
      }
      message.warning('该节点不允许测试');
      return false;
    }
    const result = await dispatch({
      type: 'activityFlow/qryMccTestContactSeg',
      payload: { processId: PROCESS_ID },
    });
    if (
      result &&
      result.svcCont &&
      result.svcCont.data &&
      result.svcCont.data.length > 0 &&
      result.svcCont.data[0].segmentId
    ) {
      return true;
    }
    message.warning('请先配置test contact segment');
    return false;
  };

  // 获取SmartTableCode
  getSmartTableCode = async (PROCESS_ID, PROCESS_TYPE) => {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'activityFlow/getSmartTableCode',
      payload: {
        PROCESS_ID,
        PROCESS_TYPE,
      },
    });
    return result;
  };

  // 获取序列化的临时processId
  getSeqWithProcess = async () => {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'activityFlow/getSeqWithProcess',
      payload: {},
    });
    return result.svcCont.data.processId;
  };

  // 渲染右上角的工具栏
  renderContainerFloatToolsView = () => {
    const {
      campaignInfo: { campaignState = 'Editing' },
    } = this.state;
    let priv = '';
    if ('/Editing/To Editing/'.indexOf(`/${campaignState}/`) != -1) {
      priv = 'edit';
    } else if (
      '/Resume/Suspend/ToPublished/Approvaling/Publish/'.indexOf(`/${campaignState}/`) != -1
    ) {
      priv = 'suspend';
    } else if ('/Published/'.indexOf(`/${campaignState}/`) != -1) {
      priv = 'release';
    } else if (campaignState == 'Termination') {
      priv = 'termination';
    } else {
      priv = 'suspend';
    }
    const floatToolBtnsData = floatToolBtns[priv].split(',');
    const {
      editFlowSetting,
      activityInfo: { id },
      del,
      index,
    } = this.props;
    return (
      <ul className={styles.floatToolBtnsBox}>
        {floatToolBtnsData.map((item, i) => {
          if (item === 'runFlowChart') {
            return (
              <Tooltip title="运行流程图" placement="bottom" key={`nn${i}`}>
                <li className={styles.toolsItem}>
                  <Iconfont type="iconceshix" onClick={this.runFlowChart} />
                </li>
              </Tooltip>
            );
          }
          return null;
        })}
      </ul>
    );
  };

  qryNodeProcess = async node => {
    const {
      activityInfo: { flowchartId },
      dispatch,
    } = this.props;
    const { nodeList, tempType } = this.state;
    const scheduleItem = nodeList.filter(item => item.processType === 'SCHEDULE');
    if (tempType === 'edit' && scheduleItem.length >= 2) {
      message.info('任务模板无法设置定时任务');
      this.delNodeOperator(node);
    } else if (scheduleItem.length > 1) {
      message.info('只允许存在一个SCHEDULE节点');
      this.delNodeOperator(node);
    } else if (node) {
      const { processType, processTypeName } = node;
      const process = await dispatch({
        type: 'activityFlow/addMccProcess',
        payload: {
          processType,
          flowchartId,
          name: processTypeName,
        },
      });
      if (process.svcCont) {
        nodeList.map(item => {
          if (item.id === node.id) {
            item.PROCESS_ID = process.svcCont.data.processId;
          }
          return item;
        });
        this.setState({ nodeList });
      }
    }
  };

  // 流程运行
  runFlowChart = () => {
    confirm({
      content: '确定运行该流程图吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        const {
          activityInfo: { flowchartId, campaignId },
          dispatch,
        } = this.props;

        dispatch({
          type: 'activityFlow/checkInCampCyclePeriod',
          payload: { flowchartId, campaignId },
        }).then(result => {
          if (result) {
            if (result.topCont.resultCode == '0') {
              message.success('运行流程图成功');
              this.setState({ clickState: 'Y' });
              this.refreshProcessRunStatus();
            } else {
              message.error(result.topCont.remark);
            }
          } else {
            message.error('流程图运行失败');
          }
        });
      },
    });
  };

  runPeriodFlowChart = () => {
    const {
      activityInfo: { id },
      dispatch,
      userInfo,
    } = this.props;
    // dispatch({
    //   type: 'activityFlow/runFlowChart',
    //   payload: {
    //     FLOWCHART_ID: id,
    //     PERIOD_ID: '',
    //     RUNBY_USER: userInfo.staffInfo.staffName,
    //     RUNBY_USER_NAME: userInfo.staffInfo.staffId,
    //   },
    // }).then(result => {
    //   if (result && result.topCont.resultCode == '0' && result.svcCont.data) {
    //     if (result.svcCont.data.success) {
    //       message.success('运行流程图成功');
    //     } else {
    //       message.success('运行流程图失败');
    //     }
    //     // 刷新状态
    this.refreshProcessRunStatus();
    //   } else if (result.topCont.resultCode != '-1') {
    //     message.warning(
    //       formatMessage({
    //         id: `activityConfigManage.FLOWCHART_COMMON.${result.topCont.resultCode.replace(
    //           /-/g,
    //           '_',
    //         )}`,
    //       }),
    //     );
    //   } else {
    //     message.error('运行流程图失败');
    //   }
    // });
  };

  // 流程定时
  flowSchedule = () => {
    this.setState({
      showScheduleModal: true,
      scheduleType: 'FLOWCHART',
    });
  };

  // 控制hover
  handleHoverChange = (visible, index) => {
    this.setState({
      hovered: visible ? index : -1,
      clicked: -1,
    });
  };

  // 控制click
  handleClickChange = (visible, index) => {
    this.setState({
      clicked: visible ? index : -1,
      hovered: -1,
    });
  };

  hoverContent = item => {
    const { processType } = item;
    let content;
    let title;
    switch (processType) {
      case 'APP':
        content = formatMessage({ id: 'activityConfigManage.chart.pop.content.APP' });
        title = formatMessage({ id: 'activityConfigManage.chart.pop.title.APP' });
        break;
      case 'SELECT':
        content = formatMessage({ id: 'activityConfigManage.chart.pop.content.SELECT' });
        title = formatMessage({ id: 'activityConfigManage.chart.pop.title.SELECT' });
        break;
      case 'SCHEDULE':
        content = formatMessage({ id: 'activityConfigManage.chart.pop.content.SCHEDULE' });
        title = formatMessage({ id: 'activityConfigManage.chart.pop.title.SCHEDULE' });
        break;
      default:
        content = null;
        title = null;
    }
    return [title, content];
  };

  render() {
    const { activityInfo } = this.props;
    const {
      campaignInfo: { campaignState },
      readOnly,
      processTypes,
      nodeList,
      deleteBoxPosition,
      showDeleteBoxPosition,
      showSelctModal,
      showNextStageModal,
      showIreModal,
      showSampleModal,
      showListenerModal,
      showAbDecisionModal,
      nodeData,
      prevAllNodeData,
      prevNodeData,
      nextNodeData,
      showAppModal,
      showScheduleModal,
      showModalCustomner,
      containerLeft,
      containerTop,
      showSegmentModal,
      showSetModal,
      showDirectBonusModal,
      scheduleType,
      clicked,
      hovered,
      clickState,
    } = this.state;

    return (
      <div className={styles.chart}>
        {!readOnly ? (
          <div className={styles.leftContent}>
            {processTypes &&
              processTypes.length > 0 &&
              processTypes.map((item, index) => {
                return (
                  <div className={styles.typeContent} key={`oo${index}`}>
                    <div className={styles.title} onClick={() => this.changeSlide(item, index)}>
                      <Icon
                        type="down"
                        className={classnames('mr5', styles.icon, {
                          [styles.hideItem]: !!item.hideItem,
                        })}
                      />
                      <span>{item.processTypeName}</span>
                    </div>

                    {item.mccProcessTypes && item.mccProcessTypes.length > 0 && (
                      <div
                        className={classnames(styles.typeBox, {
                          [styles.hideItem]: !!item.hideItem,
                        })}
                      >
                        <Row gutter={16}>
                          {item.mccProcessTypes.map((v, i) => {
                            return (
                              <Col span={6} key={`ii${i}`}>
                                <div className={styles.item}>
                                  <div
                                    className={classnames(styles.iconItem, 'component')}
                                    style={{ backgroundColor: v.backgroundColor }}
                                    draggable
                                    onDragStart={event => {
                                      event.dataTransfer.setData('data', JSON.stringify(v));
                                    }}
                                  >
                                    <Iconfont type={v.icon || 'icon-APP'} className={styles.icon} />
                                  </div>
                                  <Tooltip title={v.processTypeName} placement="left">
                                    <div className={styles.name}>{v.processTypeName}</div>
                                  </Tooltip>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : null}

        <div className={styles.rightContent}>
          <div className={styles.flowBox}>
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
                  this.setState({
                    containerLeft: addLeft + this.containerLeft,
                    containerTop: addTop + this.containerTop,
                  });
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
                const data = JSON.parse(event.dataTransfer.getData('data'));
                const { offsetX, offsetY } = event.nativeEvent;
                const id = `NANO_${randomWord(false, 40)}`;
                const points = [
                  { id: `NANO_${randomWord(false, 40)}`, dataType: '00', anchor: 'TopCenter' },
                  { id: `NANO_${randomWord(false, 40)}`, dataType: '00', anchor: 'RightMiddle' },
                  { id: `NANO_${randomWord(false, 40)}`, dataType: '00', anchor: 'BottomCenter' },
                  { id: `NANO_${randomWord(false, 40)}`, dataType: '00', anchor: 'LeftMiddle' },
                ];
                const node = {
                  ...data,
                  x: offsetX - 90 - Number(containerLeft),
                  y: offsetY - 30 - Number(containerTop),
                  id,
                  points,
                  NODE_STATE: '1',
                  RESULT_VALUE: 0,
                  HAS_RUN: 'N',
                  ERROR_MSG: '',
                  PROCESS_ID: '',
                };
                this.setState(
                  {
                    nodeList: [...nodeList, node],
                  },
                  () => {
                    this.initNodeElememt(id, node);
                    this.qryNodeProcess(node);
                    this.refreshXml(node);
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
                  ? nodeList.map((item, index) => {
                      return (
                        <Popover
                          key={item.id}
                          style={{ width: 100 }}
                          content={this.hoverContent(item)[1]}
                          title={this.hoverContent(item)[0]}
                          trigger="hover"
                          visible={hovered === index && !!this.hoverContent(item)[1]}
                          onVisibleChange={visible => this.handleHoverChange(visible, index)}
                        >
                          <Popover
                            content={this.renderTachePopover(item)}
                            arrowPointAtCenter
                            placement="top"
                            trigger="click"
                            visible={clicked === index}
                            onVisibleChange={visible => {
                              this.handleClickChange(visible, index);
                            }}
                            autoAdjustOverflow
                            title={null}
                            overlayStyle={{ zIndex: 2 }}
                            overlayClassName={styles.tachePopover}
                          >
                            <li
                              className={classnames(styles.item, 'flowChartNode')}
                              style={{ left: `${item.x || 0}px`, top: `${item.y || 0}px` }}
                              id={item.id}
                              onDoubleClick={() => {
                                this.edit(item);
                              }}
                            >
                              <a
                                className={classnames(styles.tacheA, {
                                  [styles.tacheInitial]: !item.NODE_STATE || item.NODE_STATE == 1,
                                })}
                              >
                                <span
                                  className={classnames(styles.iconItem)}
                                  style={{ backgroundColor: item.backgroundColor }}
                                >
                                  <Iconfont
                                    type={item.icon || 'icon-APP'}
                                    className={styles.icon}
                                  />
                                </span>
                                <div className={styles.content}>
                                  <span className={styles.name}>{item.processTypeName}</span>
                                  <span className={styles.desc}>
                                    {item.channelcode || item.processType}
                                  </span>
                                </div>
                                <div className={styles.iconBox}>
                                  <Iconfont
                                    type={(() => {
                                      const status = String(item.NODE_STATE || '1');
                                      switch (status) {
                                        case '1':
                                          return 'iconunconfig-params';
                                        case '2':
                                          return 'iconconfig-params';
                                        case '3':
                                          return 'icon-Next';
                                        case '4':
                                          return 'iconcheckx';
                                        case '5':
                                          return 'iconrefresh';
                                        case '6':
                                          return 'iconerrorx';
                                        case '7':
                                          return 'iconstop';
                                        default:
                                          return 'iconunconfig-params';
                                      }
                                    })()}
                                    className={classnames(styles.iconStatus, {
                                      [styles.success]: item.NODE_STATE == 4,
                                      [styles.fail]: item.NODE_STATE == 6,
                                      [styles.stop]: item.NODE_STATE == 3 || item.NODE_STATE == 7,
                                    })}
                                  />
                                  {item.processType != 'SCHEDULE' && (
                                    <div className={styles.num}>{item.RESULT_VALUE || 0}</div>
                                  )}
                                </div>
                              </a>
                            </li>
                          </Popover>
                        </Popover>
                      );
                    })
                  : null}

                {showDeleteBoxPosition && (
                  <div
                    className={styles.deleteBox}
                    style={deleteBoxPosition}
                    onClick={() => this.rightDeleteConnection()}
                  >
                    <div>
                      <Iconfont type="iconshanchux" />
                      <span>删除</span>
                    </div>
                  </div>
                )}
              </ul>

              {this.renderContainerFloatToolsView()}
            </div>
          </div>
        </div>

        {showSelctModal && (
          <Select
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showAppModal && (
          <Contact
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState, nodeData }}
          />
        )}

        {showNextStageModal && (
          <NextStage
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showIreModal && (
          <Ire
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {/* 区分流程的定时任务还是节点的定时任务 */}
        {showScheduleModal && (
          <Schedule
            onCancel={this.onCancel}
            onOk={this.onOk}
            activityInfo={{ ...activityInfo, campaignState }}
            scheduleType={scheduleType}
            {...(scheduleType === 'PROCESS'
              ? {
                  nodeData,
                  prevNodeData,
                  nextNodeData,
                }
              : {})}
          />
        )}

        {showModalCustomner && (
          <ModalCustomner onCancel={this.onCancel} processId={nodeData.PROCESS_ID} />
        )}

        {showSegmentModal && (
          <Segment
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showSetModal && (
          <Set
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showSampleModal && (
          <Sample
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showDirectBonusModal && (
          <DirectBonus
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showListenerModal && (
          <Listener
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}

        {showAbDecisionModal && (
          <AbDecision
            onCancel={this.onCancel}
            onOk={this.onOk}
            nodeData={nodeData}
            prevAllNodeData={prevAllNodeData}
            prevNodeData={prevNodeData}
            nextNodeData={nextNodeData}
            activityInfo={{ ...activityInfo, campaignState }}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Chart);
