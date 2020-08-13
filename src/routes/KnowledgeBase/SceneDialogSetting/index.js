/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { Divider, Button, Tabs, message, Modal } from 'antd';
import { connect } from 'dva';
import G6Editor from '@antv/g6-editor';
import { getLayoutHeight } from '../../../utils/eventUtils';
import { sceneDialogSetNode } from '../../../utils/resource';
import Page from '../../../components/G6EditorFlow/Page.jsx';
import ToolBar from '../../../components/G6EditorFlow/Toolbar.jsx';
import CommonMenuIcon from '../../../components/CommonMenuIcon';
import Editor from '../../../components/G6EditorFlow/Editor.jsx';
import SettingCondModal from './SettingCondModal';
import SettingReplayModal from './SettingReplayModal';
import SettingFunctionModal from './SettingFunctionModal';
import SettingBranchModal from './SettingBranch';
import SettingModal from './SettingModal';
import '../../../components/G6EditorFlow/G6Editor.less';
import SceneDialogSetTest from './SceneDialogSetTest';
import { botsceneTrain } from '../../../services/sceneApiList';
import { getResMsg } from '../../../utils/codeTransfer';

let { Flow } = G6Editor;
const { TabPane } = Tabs;

let isRegisterNode = false;
let isShowLast = false;
let isResetToLastPublish = false;
let showPage = {};
let socketInterval;
// 注册模型卡片基类
Flow.registerNode('model-card', {
  draw(item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const width = 160;
    const height = 40;
    const x = -width / 2;
    const y = -height / 2;
    const borderRadius = 2;
    const keyShape = group.addShape('rect', {
      attrs: {
        x,
        y,
        width,
        height,
        style: {
          borderWidth: '1px',
        },
        radius: borderRadius,
        fill: 'white',
        stroke: '#CED4D9',
      },
    });
    // 类型 logo
    group.addShape('image', {
      attrs: {
        img: this.type_icon_url,
        x: x + 8,
        y: y + 10,
        width: 20,
        height: 20,
      },
    });
    // 名称文本
    const label = model.label ? model.label : this.label;
    group.addShape('text', {
      attrs: {
        text: label,
        x: x + 40,
        y: y + 13,
        textAlign: 'start',
        textBaseline: 'top',
        fill: 'rgba(0,0,0,0.65)',
        styles: {
          fontSize: 14,
        },
      },
    });
    // 状态 logo
    group.addShape('image', {
      attrs: {
        img: this.state_icon_url,
        x: x + 98,
        y: y + 14,
        width: 14,
        height: 14,
      },
    });
    return keyShape;
  },
});

function getNumber(number) {
  if (number < 0) return 20;
  return number;
}
const getNodeAnchorArr = (input, output) => {
  let anchor = [];
  const curInput = getNumber(input);
  const curOutput = getNumber(output);
  const inNum = (1 / (curInput - 1)).toFixed(2);
  const outNUm = (1 / (curOutput - 1)).toFixed(2);
  if (curInput === 0) {
    anchor = [];
  } else if (curInput === 1) {
    anchor.push([0, 0.5, { type: 'input' }]);
  } else {
    for (let j = 0; j < curInput; j += 1) {
      anchor.push([0, j * inNum, { type: 'input' }]);
    }
  }

  if (curOutput === 0) return anchor;
  if (curOutput === 1) {
    anchor.push([1, 0.5, { type: 'output' }]);
  } else {
    for (let m = 0; m < curOutput; m += 1) {
      anchor.push([1, m * outNUm, { type: 'output' }]);
    }
  }
  return anchor;
};

const registerNode = (source = []) => {
  if (isRegisterNode) return;
  window.nodeAnchor = {};

  source.forEach((item) => {
    const anchor = getNodeAnchorArr(item.inputWiresNum, item.outputWiresNum, item.code);
    window.nodeAnchor[item.code] = { anchor, input: -1, output: getNumber(item.inputWiresNum) - 1 };
    Flow.registerNode(
      item.code,
      {
        label: item.name,
        type_icon_url: sceneDialogSetNode[item.code] || sceneDialogSetNode.enterchatflow || '',
        // 默认锚点的位置在做题两边
        anchor: anchor || [
          [0, 0.33, { type: 'input' }],
          [0, 0.66, { type: 'input' }],
          [1, 0.33, { type: 'output' }],
          [1, 0.66, { type: 'output' }],
        ],
      },
      'model-card'
    );
  });
  isRegisterNode = true;
};
let lastClickTime = '';

@connect((props) => {
  const { sceneDialogSetting } = props;
  return { sceneDialogSetting };
})
class SceneDialogSetting extends Editor {
  state = {
    messageList: [],
    modalType: '', // 当前的Modal类型
    settingModalVisible: false, // 当前设置项修改Modal的标志
    settingFunctionVisible: false, // 函数配置
    editItem: {}, // 当前修改Modal的数据
  };
  componentDidMount() {
    // 重置参数，保证每次都能注册一次节点，并且能焕然一次页面，
    isRegisterNode = false;
    isShowLast = false;
    Flow = G6Editor.Flow;
    showPage = {};
    // socket连接
    // const user = getUserInfo()
    // curSocket = io.connect(`${global.socket_url  }/botchatflow/event?orgi=${user.orgi}&userid=${user.id}`);
    // curSocket.on('connect',  ()=> {
    //   console.log("连接初始化成功");
    // }).on('disconnect', () => {
    //   console.log("连接已断开");
    // }).on('testBotchatflow',(data)=>{
    //   const { messageList } = this.state;
    //   const mesLength = messageList.length;
    //   if(mesLength && messageList[mesLength-1].id === data.id) return;
    //   messageList.push(data);
    //   this.setState({messageList},()=>{
    //     if(this.testMessage.handleScrollToBottom)this.testMessage.handleScrollToBottom();
    //   });
    // })

    // // 保持连接
    // if(socketInterval) clearInterval(socketInterval)
    // socketInterval = setInterval(()=>{
    //   curSocket.connect()
    // },10*1000);

    // curSocket.connect()

    const { dispatch } = this.props;
    dispatch({
      type: 'sceneDialogSetting/fetchSysChatTypeList',
    }).then(() => {
      this.handleGetChatFlow();
    });
    // 获取历史测试列表，
    // dispatch({
    //   type:'sceneDialogSetting/fetchGetTestMessage',
    //   payload:{
    //     sceneid:sceneId,
    //   },
    // })
    setTimeout(() => {
      super.componentDidMount();
      const page = this.page;
      showPage = page;
      const graph = page.getGraph();
      // 节点点击触发， 加了点击事件后没有delete 失效
      graph.on('node:click', (e) => {
        if (!e || !e.item || !e.item.model) return;
        const now = new Date().getTime();
        if (now - lastClickTime < 300) {
          this.showSettingModal(e.item.model);
        }
        lastClickTime = now;
      });
      // 数据改变触发当前的
      // page.on('afterchange',event =>{
      //   this.handleDarfSave();
      // })
      // 输入锚点不可以连出边
      page.on('hoveranchor:beforeaddedge', (ev) => {
        if (ev.anchor.type === 'input') {
          ev.cancel = true;
        }
      });
      page.on('dragedge:beforeshowanchor', (ev) => {
        // 只允许目标锚点是输入，源锚点是输出，才能连接
        if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
          ev.cancel = true;
        }
        // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
        if (
          ev.dragEndPointType === 'target' &&
          page.anchorHasBeenLinked(ev.target, ev.targetAnchor)
        ) {
          ev.cancel = true;
        }
        // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
        if (
          ev.dragEndPointType === 'source' &&
          page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)
        ) {
          ev.cancel = true;
        }
      });
      graph.edge({
        style: {
          endArrow: false,
          lineWidth: 1.5,
        },
      });
    }, 100);
  }
  componentWillReceiveProps(nextprops) {
    const { messageList } = this.state;
    const {
      sceneDialogSetting: { sysChatTypeList, testMessageList },
      sceneDialogSetting: { savedBotChatFlowSet = {} },
    } = nextprops;
    if (
      JSON.stringify(sysChatTypeList) !==
      JSON.stringify(this.props.sceneDialogSetting.sysChatTypeList)
    ) {
      registerNode(sysChatTypeList); // 注册节点
    }
    if (
      savedBotChatFlowSet.id &&
      (!this.props.savedBotChatFlowSet || !this.props.savedBotChatFlowSet.id)
    ) {
      // 延时操作， 不然获取不到g6的page,
      setTimeout(() => {
        this.showLastFlow(savedBotChatFlowSet);
      }, 100);
    }
    if (!messageList.length && JSON.stringify(messageList) !== JSON.stringify(testMessageList)) {
      this.setState({ messageList: testMessageList }, () => {
        // 坑的写法尽量不要用
        if (this.isScroll) return;
        this.timer = setInterval(() => {
          if (this.testMessage.handleScrollToBottom && !this.isScroll) {
            this.testMessage.handleScrollToBottom();
            this.isScroll = true;
            clearInterval(this.timer);
          }
        }, 300);
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sceneDialogSetting/clearSetState' });
    if (socketInterval) clearInterval(socketInterval);
  }
  // 获取上一次的页面的信息
  showLastFlow = (savedBotChatFlowSet = {}) => {
    if (!isShowLast && !!isRegisterNode && savedBotChatFlowSet.id) {
      const { nexus = '[]', nodes = '[]' } = savedBotChatFlowSet;
      const obj = { edges: JSON.parse(nexus), nodes: JSON.parse(nodes) };
      if (!showPage.read) return;
      if (!isResetToLastPublish) {
        showPage.read({ ...obj });
        isShowLast = true;
        return;
      }
      if (isResetToLastPublish) {
        showPage.read({ ...obj });
        isShowLast = true;
        isResetToLastPublish = false;
        this.handleDarfSave();
      }
    }
  };
  /*
   * 获取发布版本
   * isGetPublish 1 获取发布了的版本
   */
  handleGetChatFlow = () => {
    const { dispatch, sceneId = '' } = this.props;
    dispatch({
      type: 'sceneDialogSetting/fetchGetBotChatFlowSet',
      payload: {
        sceneId,
        canvasWidth: 700,
        canvasHeight: 350,
        nodeWidth: 120,
        nodeHeight: 38,
      },
    }).then((res) => {
      if (!res || res.msg !== 'botscene_nexus_release_null') return;
      Modal.confirm({
        title: '确认重置？',
        content: '没有已发布的版本',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'sceneDialogSetting/saveBotChatFlowSet',
            payload: { BotChatNexus: { id: 'empty' } },
          });
        },
      });
    });
  };
  handleDarfSave = () => {
    // curSocket.emit('saveDraft',obj);
  };
  // 当前节点的保存
  handleFunctionSave = (data, callback, patch) => {
    const { dispatch } = this.props;
    dispatch({
      type: patch,
      payload: data,
    }).then((res) => {
      if (!res) return;
      if (res.status === 'OK') {
        this.changePageData(res.data);
      }
      if (callback) callback(res);
    });
  };

  // 根据保存的信息来替换原来的信息；
  changePageData = (resData) => {
    const { editItem } = this.state;
    if (!resData || !resData.id || !editItem || !editItem.id) return;
    const { edges = [], nodes = [] } = this.page.save() || {};
    const newEdges = edges.map((item) => {
      if (item.source === editItem.id) {
        return {
          ...item,
          source: resData.id,
        };
      }
      if (item.target === editItem.id) {
        return {
          ...item,
          target: resData.id,
        };
      }
      return item;
    });
    const newNodes = nodes.map((item) => {
      if (item.id === editItem.id) {
        return {
          ...item,
          id: resData.id,
          // label: resData.name,
          isSet: true,
        };
      }
      return item;
    });
    this.page.read({ edges: newEdges, nodes: newNodes });
  };
  // 新建的Modal  函数modal id
  getFunctionId = (callBack) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sceneDialogSetting/fetchGetFunctionNodeId' }).then((res) => {
      if (res && res.data) {
        callBack && callBack(res.data);
      }
    });
  };
  // 校验流程图连线是否正确
  lineNotCorrect = (nodes) => {
    let correct = false;
    let error = '';
    nodes.forEach((node) => {
      if (node.shape === 'start') {
        if (!node.wires) {
          error = '入口节点需要连接触发节点！';
          correct = true;
          return;
        }
        nodes.forEach((val) => {
          if (val.shape === 'enter') {
            if (node.wires.split(',').indexOf(val.id) === -1) {
              correct = true;
              error = '触发节点只由入口节点连接！';
            }
          }
        });
      }
      if (node.shape === 'enter') {
        if (!node.wires) {
          error = '触发节点需要连接回复节点！';
          correct = true;
          return;
        }
        nodes.forEach((val) => {
          if (val.shape === 'state') {
            if (node.wires.split(',').indexOf(val.id) === -1) {
              correct = true;
              error = '回复节点只能由触发节点连接！';
            }
          }
        });
      }
      if (node.shape === 'state') {
        if (!node.wires) {
          error = '回复节点需要连接结束节点！';
          correct = true;
          return;
        }
        nodes.forEach((val) => {
          if (val.shape === 'shape') {
            if (node.wires.split(',').indexOf(val.id) === -1) {
              correct = true;
              error = '结束节点只能由回复节点连接！';
            }
          }
        });
      }
    });
    if (error) message.error(error);
    return correct;
  };
  // 校验流程图
  handleValidateFlowChart = () => {
    const { nodes = [] } = this.page.save() || {};
    const isHasNoSet = nodes.some((node) => {
      return !node.isSet;
    });
    return isHasNoSet;
  };
  // 拼接流成图的参数，并保存
  handleSaveFlowChart = () => {
    if (this.handleValidateFlowChart()) {
      message.error('当前流程图存在未设置的节点！');
      return;
    }
    const { sceneId = '', dispatch, closeSetting } = this.props;
    const { nodes = [], edges = [] } = this.page.save() || {};
    let obj = {};
    edges.forEach((item) => {
      if (obj[item.source]) {
        obj[item.source].push(item.target);
      } else {
        obj[item.source] = [item.target];
      }
    });
    const newNodes = nodes.map((node) => {
      if (obj[node.id]) {
        return {
          ...node,
          wires: obj[node.id].join(','),
        };
      }
      return node;
    });
    if (this.lineNotCorrect(newNodes)) return;
    obj = {
      sceneId,
      nodes: JSON.stringify(newNodes),
      nexus: JSON.stringify(edges),
    };
    dispatch({
      type: 'sceneDialogSetting/fetchSaveBotChatFlowSet',
      payload: obj,
    }).then((res) => {
      if (!res) return;
      if (res.status === 'OK') {
        message.success('场景对话设置成功！');
        closeSetting();
      } else {
        message.error(getResMsg(res.msg));
      }
    });
  };
  // 显示当前设置的修改Modal
  showSettingModal = (item) => {
    // 函数的modal
    if (item.shape === 'fun') {
      this.setState({
        settingFunctionVisible: true,
        editItem: item,
      });
    } else {
      this.setState({
        settingModalVisible: true,
        modalType: item.shape,
        editItem: item,
      });
    }
    this.curEditItem = item;
  };
  closeModal = () => {
    this.setState({
      settingModalVisible: false,
      settingFunctionVisible: false,
      editItem: {},
      modalType: '',
    });
    this.curEditItem = {};
  };
  /*  收起的操作只能用样式来做，直接不显示出来的话，会无法拖拽，可能跟g6有关，原因不明 */
  renderNode = (items) => {
    return items.map((item) => (
      <div
        key={item.code}
        style={{ display: 'block' }}
        data-shape={item.code}
        data-size="80*30"
        data-type="node"
        className="getItem"
      >
        <img
          className="width20"
          src={sceneDialogSetNode[item.code] || sceneDialogSetNode.enterchatflow || ''}
        />
        <span className="margin-left-10">{item.name}</span>
        <span className="pannel-type-icon" />
        <CommonMenuIcon className="floatRight getItemEdit" />
      </div>
    ));
  };

  // 如果当前的节点是有变化的 在返回上一级的时候通过socket保存到草稿流程图
  handleCloseSetting = () => {
    const { closeSetting } = this.props;
    closeSetting();
  };
  handleSend = () => {
    // curSocket.emit('testBotchatflow',obj);
  };
  // 场景训练
  handleBotsceneTrain = () => {
    const { sceneId } = this.props;
    botsceneTrain({ sceneid: sceneId }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('训练成功');
      }
    });
  };
  // 重置
  handleReset = () => {
    isShowLast = false;
    isResetToLastPublish = true;
    this.handleGetChatFlow('1');
  };
  // curEditItem
  testMessage = {};
  curEditItem = {};
  isScroll = false;
  render() {
    const {
      sceneId,
      sceneDialogSetting: { sysChatTypeList = [] },
    } = this.props;
    const {
      modalType,
      messageList,
      settingModalVisible,
      settingFunctionVisible,
      editItem,
    } = this.state;
    const clientHeight =
      window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
    const settingEditModalProps = {
      sceneId,
      visible: settingModalVisible,
      editItem,
      closeModal: this.closeModal,
      getId: this.getFunctionId,
      onHandleOk: this.handleFunctionSave,
    };
    const settingFunctionModalProps = {
      width: '600px',
      visible: settingFunctionVisible,
      editItem,
      closeModal: this.closeModal,
      getId: this.getFunctionId,
      onHandleOk: this.handleFunctionSave,
    };
    return (
      <React.Fragment>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 210 }} className="floatLeft">
            <span className="title">对话配置</span>
            <Divider type="vertical" />
            <span className="subtitle pointer btn" onClick={this.handleCloseSetting}>
              返回上一级
            </span>
          </div>

          <div className="floatLeft line-height50 flex1">
            <ToolBar handleReset={this.handleReset} />
          </div>
          <div style={{ width: 240, zIndex: 100 }} className="floatRight">
            <Button onClick={this.handleCloseSetting}>取消</Button>
            <Button className="margin-left-10" onClick={this.handleSaveFlowChart} type="primary">
              保存
            </Button>
            {/* <Button className="margin-left-10" onClick={this.handleBotsceneTrain} type="primary" >场景训练</Button> */}
          </div>
        </div>
        <div className="border height100 flexBox" style={{ height: getLayoutHeight(260) }}>
          <div
            className="border-right"
            id="scrollYTabsContent"
            style={{ width: 210, height: '100%', background: '#F7F9FA' }}
          >
            <Tabs
              className="equableTabs scrollYTabs"
              tabBarStyle={{ height: 45, width: '100%', background: '#fff' }}
            >
              <TabPane tab="配置" key="1">
                <div
                  id="itempannel"
                  className="textFlexCenter"
                  style={{
                    height: clientHeight - 305,
                    padding: '0 20px 0 30px',
                    overflowY: 'auto',
                  }}
                >
                  <div className="flex1 margin-top-10">{this.renderNode(sysChatTypeList)}</div>
                </div>
              </TabPane>
              <TabPane tab="测试" key="2">
                <SceneDialogSetTest
                  ref={(ele) => {
                    this.testMessage = ele;
                  }}
                  messageList={messageList}
                  emitMessage={this.handleSend}
                  style={{ height: clientHeight - 305 }}
                />
              </TabPane>
            </Tabs>
          </div>
          <div className="flex1 userSelectNot">
            <Page />
          </div>
        </div>
        {settingModalVisible && modalType === 'enter' && (
          <SettingCondModal {...settingEditModalProps} />
        )}
        {settingModalVisible && modalType === 'state' && (
          <SettingReplayModal {...settingEditModalProps} />
        )}
        {settingModalVisible && modalType === 'UMI' && (
          <SettingBranchModal {...settingEditModalProps} />
        )}
        {settingModalVisible &&
          modalType &&
          modalType !== 'enter' &&
          modalType !== 'state' &&
          modalType !== 'UMI' && <SettingModal {...settingEditModalProps} />}
        {settingFunctionVisible && <SettingFunctionModal {...settingFunctionModalProps} />}
      </React.Fragment>
    );
  }
}

export default SceneDialogSetting;
