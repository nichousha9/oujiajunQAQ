import { getStaticParamList,getStaticParam,saveStaticParam,deleteStaticParam} from '../services/systemSum';
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'staticData',

  state: {
    staticDataList: {},
  },

  effects: {
    *fetchStaticDataList({payload}, { call, put }) {
      const response = yield call(getStaticParamList,payload);
      if(response && response.status === 'OK'){
        yield put({
          type: 'saveStaticDataList',
          payload: response,
        });
      }
    },
    *fetchGetCurData({payload}, { call }) {
      const response = yield call(getStaticParam,payload);
      return response;
    },
    *fetchSaveData({payload}, { call }) {
      const response = yield call(saveStaticParam,payload);
      return response;
    },
    *fetchDeleteData({payload}, { call }) {
      const response = yield call(deleteStaticParam,payload);
      return response;
    },
  },

  reducers: {
    saveStaticDataList(state, { payload }) {
      return {
        ...state,
        staticDataList: getPaginationList(payload),
      };
    },
  },
};
