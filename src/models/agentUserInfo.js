import {getAgentRemarks,addAgentRemark,agentuserUpdate, listWorkorderByUserid } from "../services/api";

export default {
  namespace:'agentUserInfo',
  state: {
    remarkList:[], // 跟进记录的列表
    wordOrderList:[], // 工单列表
  },
  effects: {
    *fetchGetWorkOrderList({ payload },{ call,put}){
      const response = yield call(listWorkorderByUserid,payload);
      if(response.status === 'OK') {
        yield put({
          type: 'saveWordOrderList',
          payload: response.data,
        })
      }
    },
    *fetchGetRemarkList({ payload },{ call,put}){
      const response = yield call(getAgentRemarks,payload);
      if(response.status === 'OK') {
        yield put({
          type: 'saveRemarkList',
          payload: response.data,
        })
      }
    },
    *fetchAddAgentRemark({payload},{call}){
      const response = yield call(addAgentRemark,payload);
      return response;
    },
    *fetchUpdateAgentUser({payload},{call}){
      const res = yield call(agentuserUpdate,payload);
      return res;
    },
  },
  reducers: {
    saveWordOrderList(state, { payload }){
      return {
        ...state,
        wordOrderList: payload,
      };
    },
    saveRemarkList(state, { payload }) {
      return {
        ...state,
        remarkList: payload,
      };
    },
    clearState(state){
      return{
        ...state,
        remarkList:[], // 清空
      }
    },
  },
}
