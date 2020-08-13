import {getCateAllList, getUserKdbList,saveCate} from "../services/api";

export default {
  namespace:'knowledgeTreeSetting',
  state: {
    kdbid:'', // 当前的知识库
    cateAllList:[], // 知识库
  },

  effects: {
    *fetchGetUserKdbList(_, { call, put }){
      const response = yield call(getUserKdbList);
      if(response.status==='OK'){
        yield put({
          type: 'saveKdbid',
          payload: response.data,
        })
        return response
      }
    },
    *fetchGetCateAllList({ payload },{ call, put }){
      const response = yield call(getCateAllList, payload);
      if(response.status === 'OK'){
        yield put({
          type: 'getCateAllList',
          payload: response.data,
        });
      }
    },
    *fetchSaveCate({ payload },{ call }){
      const response = yield call(saveCate, payload);
      return response;
    },
  },

  reducers: {
    saveKdbid(state,{payload}){
      return {
        ...state,
        kdbid:(payload[0] || {} ).id || 1,
      }
    },
    getCateAllList(state, { payload }){
      const defaultSelectCate = payload && payload[0];
      return {
        ...state,
        defaultSelectCate,
        cateAllList: payload,
      };
    },
  },
}
