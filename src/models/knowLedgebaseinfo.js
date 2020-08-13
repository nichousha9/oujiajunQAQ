import {getUserKdbList,getKdbHealth,updateKdbQuestion} from '../services/api';

export default {
  namespace: 'knowLedgebaseinfo',

  state: {
    kdbid:'', // 当前的知识库
  },

  effects: {
    *fetchGetUserKdbList(_, { call, put }){
      const response = yield call(getUserKdbList);
      if(response.status==='OK'){
        yield put({
          type: 'saveKdbid',
          payload: response.data,
        })
        return response.data;
      }
    },
    *getKdbHealth({ payload }, { call, put }) {
      const response = yield call(getKdbHealth, payload);
      if (response && response.status === 'OK') {
        return response.data;
      }
    },
    *updateKdbQuestion({ payload }, { call, put }) {
      const response = yield call(updateKdbQuestion, payload);
      if (response && response.status === 'OK') {
        return response.data;
      }
    },
  },

  reducers: {
    saveKdbid(state,{payload}){
      return {
        ...state,
        kdbid:(payload[0] || {} ).id || 1,
      }
    },
  },
};
