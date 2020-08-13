import { message } from 'antd';

import {
  qryOweInfo,
  qryGroupArrearageList,
} from '@/services/CustomerArrearage/customerArrearage';

const models = {
  namespace: 'customerArrearage',
  state: {
    groupArrearsList: [],
    oweInfo: {},
    pageInfo: {
      total: 0,
      pageNum: 1,
      pageSize: 5,
    },
  },
  
  effects: {
    *fetchOweInfoEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryOweInfo, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getOweInfo',
            payload: result.svcCont.data,
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err){
        message.error(err);
      }
    },

    *fetchGroupArrearsListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.customerArrearage.pageInfo);
        const params = { ...payload, pageInfo: { pageNum, pageSize } };
        const result = yield call(qryGroupArrearageList, params);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getGroupArrearsList',
            payload: result.svcCont.data,
          });
          const { pageNum: servePageNum, pageSize: servePageSize, total } = result.svcCont.pageInfo;
          yield put({
            type: 'getPageInfo',
            payload: {
              pageNum: servePageNum || 1,
              pageSize: servePageSize || pageSize,
              total,
            }
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },
  },

  reducers: {
    getOweInfo(state, { payload: oweInfo }) {
      return Object.assign({}, state, { oweInfo });
    },

    getGroupArrearsList(state, { payload: currentGroupArrearsList }) {
      console.log('current', currentGroupArrearsList);
      return Object.assign({}, state, { groupArrearsList: [...currentGroupArrearsList] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    }
  }
}

export default models;