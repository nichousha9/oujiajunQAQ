import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'test',

  state: {
    value: 1,
  },

  effects: {
    *test({ payload}, { put }) {
        console.log(payload);
      yield put({
        type: 'teste',
        payload:{
            value:2,
        }
      });
    },
  },

  reducers: {
    teste(state, { payload }) {
        console.log(payload);
      return {
        ...state,
        value: payload.value,
      };
    },
  },
};
