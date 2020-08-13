import { getUserOwer, deleteUserOwer, switchUserOwer } from '../services/user';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'createtenant',

  state: {
    tenantList: [],
    status:undefined,
    switchSuc: undefined,
    currentTenant:{},
  },

  effects: {
      *getUserOwer({ payload }, { call, put }) {
        const response = yield call(getUserOwer, payload);
        yield put({
          type: 'getUserOwerRE',
          payload: response,
        });
      },
      *deleteUserOwer({ payload }, { call, put }) {
        const response = yield call(deleteUserOwer, payload);
        yield put({
          type: 'deleteUserOwerRE',
          payload: response,
        });
      },
      *switchUserOwer({ payload }, { call, put }){
          const response = yield call(switchUserOwer, payload);
          yield put({
            type: 'switchUserOwerRE',
            payload: response,
          });
      }
  },

  reducers: {
      getUserOwerRE(state, { payload }) {
        return {
          ...state,
          tenantList: payload.data.tenantlist,
        };
       },
       deleteUserOwerRE(state, { payload }) {
         return {
           ...state,
           status: payload.status,
         };
        },
        switchUserOwerRE(state, { payload }) {
            return {
              ...state,
              switchSuc: payload.status,
              currentTenant: payload.data,
            };
        },
  },
}
