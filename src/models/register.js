import { accountRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
      *doRegist({ payload }, { call, put }) {
        const response = yield call(accountRegister, payload);

        yield put({
          type: 'userRegister',
          payload: response,
        });
      },

  },

  reducers: {
    //注册
  userRegister(state, { payload }) {
    return {
      ...state,
      status: payload.msg,
    };
  },
  },
};
