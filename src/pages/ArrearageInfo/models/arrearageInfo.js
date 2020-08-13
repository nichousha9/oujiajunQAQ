import { message } from 'antd';
import {
  qryArrearageList,
  qryAreaList,
} from '@/services/ArrearageInfo/arrearageInfo';

const models = {
  namespace: 'arrearageInfo',
  state: {
    arrearageList: [],
    pageInfo: {
      total: 0,
      pageSize: 10,
      pageNum: 1,
    }
  },

  effects: {
    *fetchArrearageListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.arrearageInfo.pageInfo);
        const params = { ...payload, pageInfo: { pageNum, pageSize } };
        const result = yield call(qryArrearageList, params);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getArrearageList',
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
      } catch (err) {
        message.error(err);
      }
    },

    *fetchAreaTreeData({ payload, callback }, { call }) {
      const result = yield call(qryAreaList, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          message.success(result.topCont.remark);
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    }
  },

  reducers: {
    getArrearageList(state, { payload: currentArrearageList }) {
      return Object.assign({}, state, { arrearageList: [...currentArrearageList] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo })
    },
  }
}

export default models;