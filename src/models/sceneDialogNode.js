import { getIntentionOperatorList,getIntentionList } from "../services/sceneApiList";
import { getPageList } from "../services/lexiconManagement";

export default {
  namespace: 'sceneDialogNode',
  state: {
    sceneSlotsList:[],// 场景下的词槽列表
    intentionOperatorList:[], // 操作状态的列表
    intentionList:[], // 操作状态的列表
  },
  effects: {
    *fetchGetIntentionList({ payload },{ call,put }){
      const response = yield call(getIntentionList, payload);
      if(response.status==='OK'){
        yield put({type:'saveIntentionList',payload:response.data})
      }
    },
    *fetchGetSceneSlots({ payload },{ call,put }){
      const response = yield call(getPageList, payload);
      if(response.status==='OK'){
        yield put({type:'saveSceneSlots',payload:response.data})
      }
    },
    *fetchIntentionOperatorList({ state},{ call,put }){
      const response = yield call(getIntentionOperatorList);
      if(response.status === 'OK'){
        yield put({type:'saveIntentionOperatorList',payload:response.data})
      }
    },
  },
  reducers: {
    saveIntentionList(state,{payload}){
      return {
        ...state,
        intentionList: payload,
      }
    },
    saveSceneSlots(state,{payload}){
      return {
        ...state,
        sceneSlotsList:payload.list,
      }
    },
    saveIntentionOperatorList(state,{payload}){
      return {
        ...state,
        intentionOperatorList:payload,
      }
    },
    clearSetState(state){
      return {
        ...state,
        sceneSlotsList:[],// 场景下的词槽列表
      };
    },
  },
}
