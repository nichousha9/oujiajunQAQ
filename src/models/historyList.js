import { getHistoryList,getHistoryGroupList, getOrgStaticCode,robotMsgList } from '../services/api';
import { getPaginationList } from '../utils/utils'

export default {
  namespace: 'historyList',

  state: {
      groupList:{},
      list:[],
      time:[],
      agent:[],
      channel:[],
  },

  effects: {
      *getHistoryList({ payload }, { call, put }) {
        const response = yield call(getHistoryList, payload);
        yield put({
          type: 'getHistoryListRE',
          payload: response,
        });
      },
    *fetchGetHistoryGroupList({ payload }, { call, put }) {
      const response = yield call(getHistoryGroupList, payload);
      yield put({
        type: 'saveHistoryGroupList',
        payload: response,
      });
    },
    *getOrgStaticCode({ payload }, { call, put }) {
      const response = yield call(getOrgStaticCode, payload);
      yield put({
        type: 'getOrgStaticCodeRE',
        payload: response,
        pcode:payload.pcode,
      });
    },
    * robotMsgList({ payload }, { call, put }) {
      const response = yield call(robotMsgList, payload);
      yield put({
        type: 'saveRobotMsgList',
        payload: response,
        pcode:payload.pcode,
      });
    },
  },

  reducers: {
    saveRobotMsgList(state,{payload}){
      return {
        ...state,
        robotList: getPaginationList(payload),
      }
    },
    saveHistoryGroupList(state,{payload}){
      return {
        ...state,
        groupList:getPaginationList(payload),
      }
    },
      // 获取历史记录列表
    getHistoryListRE(state, { payload }) {
      return {
        ...state,
        list:payload.data,
      };
    },
    // 获取下拉框数据
  getOrgStaticCodeRE(state, { payload, pcode }) {
      let reMap = {};
      if(pcode === ''){
          reMap.time = payload;
      }else if (pcode === '') {
          reMap.agent = payload;
      }else if (pcode === '') {
          reMap.channel = payload;
      }
      return {
        ...state,
        reMap
      };

  },
},
}
