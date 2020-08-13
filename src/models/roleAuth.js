import {
  authListByRole,
  authToRole,
  roleGetAuth,
  authToOrg,
  authListByOrg,
} from '../services/systemSum';

export default {
  namespace: 'roleAuth',
  state: {
    curAuthList: [],
    curDisableList: [],
  },
  effects: {
    *fetchGetAuthListRole({ payload }, { call, put }) {
      const response = yield call(authListByRole, payload);
      yield put({
        type: 'saveAuthList',
        payload: response.data,
      });
    },
    *fetchGetAuthListOrg({ payload }, { call, put }) {
      const response = yield call(authListByOrg, payload);
      yield put({
        type: 'saveAuthList',
        payload: { roleAuthList: response.data },
      });
    },
    // 角色授权
    *fetchAuthToRole({ payload }, { call }) {
      const response = yield call(authToRole, payload);
      return response;
    },
    // 新增权限
    *fetchRoleGetAuth({ payload }, { call }) {
      const response = yield call(roleGetAuth, payload);
      return response;
    },
    *fetchAuthToOrg({ payload }, { call }) {
      const response = yield call(authToOrg, payload);
      return response;
    },
  },
  reducers: {
    saveAuthList(state, { payload }) {
      const { roleAuthList } = payload;
      const newArr = roleAuthList.map((data) => data.authId);
      const disArr = [];
      roleAuthList.forEach((data) => {
        if (!data.changable) disArr.push(data.authId);
      });
      return {
        ...state,
        curAuthList: newArr,
        // curDisableList: disArr,
      };
    },
  },
};
