import { getTenantRel, updateUserOwer, addUserOwer } from '../services/user';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'tenantModal',

  state: {
    skillGroup:{},
    status: undefined,
  },

  effects: {
      *getTenantRel({ payload }, { call, put }) {
        const response = yield call(getTenantRel, payload);
        yield put({
          type: 'getOwerGroupRE',
          payload: response,
        });
      },
      *updateUserOwer({ payload }, { call, put }) {
        const response = yield call(updateUserOwer, payload);
        yield put({
          type: 'updateUserOwerRE',
          payload: response,
        });
      },
      *addUserOwer({ payload }, { call, put }) {
        const response = yield call(addUserOwer, payload);
        yield put({
          type: 'addUserOwerRE',
          payload: response,
        });
    },
  },

  reducers: {
        getOwerGroupRE(state, { payload }) {
          return {
            ...state,
            skillGroup: payload.data,
          };
         },
        updateUserOwerRE(state, { payload }) {
           return {
             ...state,
             status: payload.status,
           };
          },
       addUserOwerRE(state, { payload }) {
             return {
               ...state,
               status: payload.status,
             };
       },
  },
}
