import {getFunctionNodeId,getSysChatTypeList,getNodeDetail,insertAnswer,updateAnswerTrigger,getAnswerDetail,deleteNodeSetting,
  insertSlot, updateSlot, deleteSlotParam, deleteSlotAsk, getSlotDetail,saveStartAndEndChatFlow,
  getNodeSetting,updateNodeSetting,saveBotChatFlowSet,getBotChatFlowSet,getTestMessage } from "../services/api";
import { uuid } from "../utils/utils";

function getChatFlowFromNodeList(nodeArr){
  const nexus =[];
  const idToXY = {}

  nodeArr.forEach((node) => {
    idToXY[node.id] = {x:node.x,y:node.y,type:node.type,name: node.name};
  })
  const usedAnchor = {};
  function getAnchor (source,target){
    // 获取这个类型节点的出入口信息
    const sourceAnchorStart=(window.nodeAnchor[source.type] || {}).output;
    const targetAnchorStart=(window.nodeAnchor[idToXY[target].type] || {}).input;
    const sourceAnchor = ((usedAnchor[source.id] || {}).output || sourceAnchorStart) +1;
    const targetAnchor = ((usedAnchor[target] || {}).input || targetAnchorStart) +1;
    if(usedAnchor[source.id]){
      usedAnchor[source.id].output = sourceAnchor;
    }else{
      usedAnchor[source.id]={output: sourceAnchor};
    }
    if(usedAnchor[target]){
      usedAnchor[target].input = targetAnchor;
    }else{
      usedAnchor[target]={input: targetAnchor};
    }
    return {
      sourceAnchor,
      targetAnchor,
      sourceAnchorStart,
      targetAnchorStart,
    }
  }
  // 后端给的奇葩数据格式不改，只能截取  "[123232131]"
/*  function getWiresArr(wires) {
    if(!wires) return [];
    const start = wires.indexOf('[');
    return wires.substring(start+2,wires.length-2).split(',');
  } */
  const nodes = nodeArr.map((node,i)=>{
    if (node.wires) {
      const wiresArr = JSON.parse(node.wires);
      wiresArr.forEach((wire)=>{
        const anchorObj = getAnchor(node,wire) || {};
        nexus.push({
          source:node.id,
          target:wire,
          sourceAnchor:anchorObj.sourceAnchor || 0,
          targetAnchor:anchorObj.targetAnchor || 0,
          id:uuid(10),
          index:nodeArr.length+nexus.length-1,
          style: {
            endArrow: false,
            lineWidth:1.5,
          },
        });
      })
    }
    
    return {
      type:'node',
      size:'80*30',
      isSet:true,
      index:i,
      x:window.Number.parseFloat(node.x,2),
      y:window.Number.parseFloat(node.y,2),
      shape:node.type,
      id:node.id,
      name: node.name,
    }
  })
  return {
    id:'new',
    nodes:JSON.stringify(nodes || []),
    nexus:JSON.stringify(nexus || []),
  }
}
export default {
  namespace: 'sceneDialogSetting',
  state: {
    sysChatTypeList:[],// 配置配置节点的列表
    curSettingNode:{},// 当前在modal中修改的node详情，
    savedBotChatFlowSet:{},// 保存点过后的流程图，savedBotChatFlowSet，
    testMessageList:[],
  },
  effects: {
    *fetchGetTestMessage({ payload },{ call,put }){
      const response = yield call(getTestMessage, payload);
      if(response.status==='OK'){
        yield put({type:'saveTestMessage',payload:response.data})
        return response;
      }
    },
    *fetchGetBotChatFlowSet({ payload },{ call,put }){
      const response = yield call(getBotChatFlowSet, payload);
      if(response.status==='OK'){
        yield put({type:'saveBotChatFlowSet',payload:response.data || {}})
      }
      return response;
    },
    *fetchSaveBotChatFlowSet({payload},{call}){
      const response = yield call(saveBotChatFlowSet, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *fetchGetNodeDetail({payload},{call}){
      const response = yield call(getNodeDetail, payload);
      return response.data
    },
    *fetchSaveNodeSetting({payload},{call}){
      const response = yield call(getNodeSetting, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *updateSaveNodeSetting({payload},{call}){
      const response = yield call(updateNodeSetting, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *deleteNodeDetail({payload},{call}){
      const response = yield call(deleteNodeSetting, payload);
      return response
    },
    *fetchReplySetting({payload},{call}){
      const response = yield call(insertAnswer, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *updateReplySetting({payload},{call}){
      const response = yield call(updateAnswerTrigger, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *fetchReplyDetail({payload},{call}){
      const response = yield call(getAnswerDetail, payload);
      return response.data
    },
    *insertSlot({payload},{call}){
      const response = yield call(insertSlot, payload);
      return response
    },
    *updateSlot({payload},{call}){
      const response = yield call(updateSlot, payload);
      return response
    },
    *deleteSlotParam({payload},{call}){
      const response = yield call(deleteSlotParam, payload);
      return response
    },
    *deleteSlotAsk({payload},{call}){
      const response = yield call(deleteSlotAsk, payload);
      return response
    },
    *getSlotDetail({payload},{call}){
      const response = yield call(getSlotDetail, payload);
      return response
    },
    *saveStartAndEndChatFlow({payload},{call,put}){
      const response = yield call(saveStartAndEndChatFlow, payload);
      if(response.status==='OK'){
        const obj = response.data;
        yield put({
          type: 'saveCurrNode',
          payload: obj,
        });
      }
      return response
    },
    *fetchGetFunctionNodeId({payload},{call}){
      const response = yield call(getFunctionNodeId, payload);
      if(response.status==='OK'){
        return response;
      }
    },
    *fetchSysChatTypeList({payload}, {call, put}){
      const response = yield call(getSysChatTypeList, payload);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'saveSysChatTypeList',
          payload: obj,
        });
      }
    },
  },
  reducers: {
    saveTestMessage(state,{payload}){
      return {
        ...state,
        testMessageList:payload,
      }
    },
    saveSysChatTypeList(state,{payload}){
      return {
        ...state,
        sysChatTypeList:payload,
      }
    },
    saveCurrNode(state,{payload}){
      return{
        ...state,
        curSettingNode:payload,
      }
    },
    saveBotChatFlowSet(state,{payload}){
      const { newNodeList =[],BotChatNexus={} } = payload;
      const newList = newNodeList.length ? getChatFlowFromNodeList(newNodeList) : BotChatNexus;
      return {
        ...state,
        savedBotChatFlowSet:newList || {},
      }
    },
    clearSetState(state){
      return {
        ...state,
        sysChatTypeList:[],// 配置配置节点的列表
        curSettingNode:{},// 当前在modal中修改的node详情，
        savedBotChatFlowSet:{},// 保存点过后的流程图，savedBotChatFlowSet，
        testMessageList:[],
      };
    },
  },
}
