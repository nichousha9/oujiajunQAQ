import {getEntityList, getIntentionList, saveIntentionInfo,
  pickupEntity,saveIntentionDialogSample,getIntentionDialogSampleList,deleteIntentionDialog,
  getIntentionSlotList, getIntentionOperatorList, saveIntentionDialogReply, deleteIntentionDialogReply, getIntentionDialogReplyList, getByIntentId, updateIntentSlots, deleteIntentSlots, delFeatureNoun, enableFeatureNoun, modFeatureNoun, addFeatureNoun, selectAllList,
  }
  from "../services/sceneApiList";

export default {
  namespace: 'sceneIntention',
  state: {
    sceneIntentionList: [], // 意图列表
    sceneEntityList: [], // 实体列表
    pickupEntityList:[],
    dialogSampleList:[], // 对话样本列表
    dialogReplyList:[], // 快速回复列表
    intentionSlotList:[],
    intentionOperatorList:[],
  },
  effects: {
    // 获取意图列表
    *fetchSceneIntentionList({payload}, {call, put}){
      const response = yield call(getIntentionList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'getSceneIntentionList',
          payload: response.data,
        });
      }
    },

    // 保存意图
    *fetchSaveIntentionInfo({payload}, {call}){
      const res = yield call(saveIntentionInfo, payload);
      return res;
    },

    // 获取实体操作
    *fetchPickupEntity({payload}, {call,put}){
      const response = yield call(pickupEntity, payload);
      if (response.status === 'OK') {
        const obj = response.data.slot?response.data.slot:[];
        yield put({
          type: 'getPickupEntityList',
          payload: obj,
        });
      }
    },

    // 获取实体列表
    *fetchSceneEntityList({payload}, {call, put}){
      const response = yield call(getEntityList, payload);
      if (response.status === 'OK') {
        const obj = response.data.list;
        yield put({
          type: 'getSceneEntityList',
          payload: obj,
        });
      }
    },

    // 保存意图对话样本
    *fetchSaveIntentionDialogSample({payload}, {call, put}){
      const res =yield call(saveIntentionDialogSample, payload);
      if(res && res.status === 'OK'){
        // 转换参数，重新加载对话样本列表
        const{intent,intentId,sceneId:sceneid} =payload;
        const param={intent,intentId,sceneid,p:1,ps:100};
        const response = yield call(getIntentionDialogSampleList, param);
        if (response.status === 'OK') {
          const obj = response.data.list;
          yield put({
            type: 'getIntentionDialogSampleList',
            payload: obj,
          });
          return res;
        }
      }
      return res;
    },

    // 删除意图对话样本
    *fetchDeleteIntentionDialogSample({payload}, {call}){
      yield call(deleteIntentionDialog, payload);
    },

    // 获取意图对话样本列表
    *fetchIntentionDialogSampleList({payload}, {call, put}){
      const response = yield call(getIntentionDialogSampleList, payload);
      if (response.status === 'OK') {
        const obj = response.data.list;
        yield put({
          type: 'getIntentionDialogSampleList',
          payload: obj,
        });
      }
    },

   

    // 获取意图词槽
    // *fetchIntentionSlotList({payload}, {call, put}){
    //   const response = yield call(getIntentionSlotList, payload);
    //   if (response.status === 'OK') {
    //     const obj = response.data;
    //     yield put({
    //       type: 'getIntentionSlotList',
    //       payload: obj,
    //     });
    //   }
    // },
    // 获取意图短语
    *fetchIntentionSlot({payload}, {call, put}){
      const response = yield call(getIntentionSlotList, payload);
      return response;
    },

    // 通过意图Id获取意图短语
    *getByIntentId({payload}, {call, put}){
      const response = yield call(getByIntentId, payload);
      return response;
    },

    // 更新意图短语
    *updateIntentSlots({payload}, {call, put}){
      const response = yield call(updateIntentSlots, payload);
      return response;
    },

    //  删除意图短语
    *deleteIntentSlots({payload}, {call, put}){
      const response = yield call(deleteIntentSlots, payload);
      return response;
    },

    // 获取意图操作符
    *fetchIntentionOperaterList({payload}, {call, put}){
      const response = yield call(getIntentionOperatorList, payload);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'getIntentionOperatorList',
          payload: obj,
        });
      }
    },

    // 保存意图快速回复
    *fetchSaveIntentionDialogReply({payload}, {call, put}){
      yield call(saveIntentionDialogReply, payload);
      // 转换参数，重新加载对话样本列表
      const{intent,sceneId:sceneid,intentId:intentid} =payload;
      const param={intent,sceneid,intentid};
      const response = yield call(getIntentionDialogReplyList, param);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'getIntentionDialogReplyList',
          payload: obj,
        });
      }
      return response;
    },

    // 删除意图快速回复
    *fetchDeleteIntentionDialogReply({payload}, {call, put}){
      yield call(deleteIntentionDialogReply, payload);
      // 转换参数，重新加载对话样本列表
      const{sceneid,intent,intentid} =payload;
      const param={sceneid,intent,intentid};
      const response = yield call(getIntentionDialogReplyList, param);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'getIntentionDialogReplyList',
          payload: obj,
        });
      }
    },

    // 获取意图快速回复列表
    *fetchIntentionDialogReplyList({payload}, {call, put}){
      const response = yield call(getIntentionDialogReplyList, payload);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'getIntentionDialogReplyList',
          payload: obj,
        });
      }
    },

    // 获取特征词
    *selectAllList({payload}, {call}){
      const response = yield call(selectAllList, payload);
      return response;
    },
    // 新增特征词
    *addFeatureNoun({payload}, {call}){
      const response = yield call(addFeatureNoun, payload);
      return response;
    },
    // 编辑特征词
    *modFeatureNoun({payload}, {call}){
      const response = yield call(modFeatureNoun, payload);
      return response;
    },
    // 停止启用
    *enableFeatureNoun({payload}, {call}){
      const response = yield call(enableFeatureNoun, payload);
      return response;
    },
    // 删除特征词
    *delFeatureNoun({payload}, {call}){
      const response = yield call(delFeatureNoun, payload);
      return response;
    },

  },
  reducers: {
    getSceneIntentionList(state, {payload}){
      return {
        ...state,
        sceneIntentionList: payload,
      };
    },

    getSceneEntityList(state, {payload}){
      return {
        ...state,
        sceneEntityList: payload,
      };
    },

    getIntentionDialogSampleList(state, {payload}){
      return {
        ...state,
        dialogSampleList: payload,
      };
    },

    getIntentionDialogReplyList(state, {payload}){
      return {
        ...state,
        dialogReplyList: payload,
      };
    },

    getPickupEntityList(state,{payload}){
      return {
        ...state,
        pickupEntityList: payload,
      };
    },

    getIntentionSlotList(state, {payload}){
      return {
        ...state,
        intentionSlotList: payload,
      };
    },

    getIntentionOperatorList(state, {payload}){
      return {
        ...state,
        intentionOperatorList: payload,
      };
    },
  },
}
