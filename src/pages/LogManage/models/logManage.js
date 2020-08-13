import { message } from 'antd';

import {
  qrySystemUserLoginLogList,
  qrySystemUserHistoryMenuLogList,
} from '@/services/LogManage/logManage';

const models = {
  namespace: 'logManage',
  state: {
    loginLogList: [],
    loginPageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    menuLogList: [],
    menuPageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  },

  effects: {
    *qrySystemUserLoginLogList({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.logManage.loginPageInfo);
        const pageInfo = { pageNum, pageSize };
        const params = { ...payload, pageInfo };
        const result = yield call(qrySystemUserLoginLogList, params);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getLoginLogList',
            payload: result.svcCont.data,
          });
          const { pageNum: servePageNum, pageSize: servePageSize, total } = result.svcCont.pageInfo;
          yield put({
            type: 'getLoginPageInfo',
            payload: {
              pageNum: servePageNum || 1,
              pageSize: servePageSize || pageInfo.pageSize,
              total,
            },
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },

    *qrySystemUserHistoryMenuLogList({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.logManage.menuPageInfo);
        const pageInfo = { pageNum, pageSize };
        const params = { ...payload, pageInfo };
        const result = yield call(qrySystemUserHistoryMenuLogList, params);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getMenuLogList',
            payload: result.svcCont.data,
          });
          const { pageNum: servePageNum, pageSize: servePageSize, total } =
            result.svcCont.pageInfo || {};
          yield put({
            type: 'getMenuPageInfo',
            payload: {
              pageNum: servePageNum || 1,
              pageSize: servePageSize || pageInfo.pageSize,
              total,
            },
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },
  },

  reducers: {
    getLoginLogList(state, { payload: currentLoginLogList }) {
      return Object.assign({}, state, { loginLogList: [...currentLoginLogList] });
    },

    getLoginPageInfo(state, { payload: loginPageInfo }) {
      return Object.assign({}, state, { loginPageInfo });
    },

    getMenuLogList(state, { payload: currentMenuLogList }) {
      return Object.assign({}, state, { menuLogList: [...currentMenuLogList] });
    },

    getMenuPageInfo(state, { payload: menuPageInfo }) {
      return Object.assign({}, state, { menuPageInfo });
    },
  },
};

export default models;
