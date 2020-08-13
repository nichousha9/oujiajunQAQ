import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getLoginInfo, getLogin, getLogout, updateSession } from '@/services/common';

const UserModel = {
  namespace: 'user',
  state: {
    userInfo: '',
    orgInfo: '',
  },
  effects: {
    *getLogin({ payload }, { call, put }) {
      const res = yield call(getLogin, payload);
      if (res && res.topCont) {
        const { resultCode, remark } = res.topCont;
        if (resultCode == 0) {
          message.success('登录成功');
          yield put(
            routerRedux.push({
              pathname: '/',
            }),
          );
        } else {
          message.error(remark || '登录失败');
        }
      }
    },

    *getLoginInfo({ payload }, { call, put }) {
      const res = yield call(getLoginInfo, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { data } = res;
        yield put({
          type: 'changeUserInfo',
          payload: data,
        });
      }
    },
    *updateSaasSession({ payload }, { call, put }) {
      const res = yield call(updateSession, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { data } = res;
        yield put({
          type: 'changeUserInfo',
          payload: data,
        });
      }
      return res;
    },

    *logout(_, { call, put }) {
      const res = yield call(getLogout, {});
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (window.location.pathname !== '/login') {
          yield put(
            routerRedux.replace({
              pathname: '/login',
            }),
          );
        }
      }
    },
  },
  reducers: {
    changeUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
        orgInfo: payload,
      };
    },
  },
};
export default UserModel;
