import { detailUser, upDateUser, addUser } from '../services/systemSum';

export default {
  namespace: 'addUserAccount',

  state: {
    userInfo: {},
  },

  effects: {
    *fetchGetUserDetail({ payload }, { call, put }) {
      const response = yield call(detailUser,payload);
      yield put({
        type: 'updateUserInfo',
        payload: response.data || {},
      });
    },
    *fetchSaveUser({ payload }, { call, put }) {
      const response = yield call(payload.id ? upDateUser: addUser,payload);
      return response;
    },
  },

  reducers: {
    updateUserInfo(state, {payload}) {
      return {
        ...state,
        userInfo: payload,
      };
    },
  },
};
