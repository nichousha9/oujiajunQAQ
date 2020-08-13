import { getChildRegions,saveRegion, deleteRegion} from '../services/systemSum';


export default {
  namespace: 'areaDataManager',

  state: {
    allRegions: [],
  },

  effects: {
    *fetchGetAllRegions({payload}, { call, put }) {
      const response = yield call(getChildRegions,payload);
      if(response && response.status === 'OK'){
        yield put({
          type: 'saveAllRegions',
          payload: response.data,
        });
      }
    },
    *fetchSaveRegion({ payload },{call, put }) {
      const response = yield call(saveRegion,payload);
      if(response && response.status === 'OK'){
        yield put({
          type: 'saveNewAllRegions',
          payload: response.data,
        });
      }
      return response;
    },
    *fetchDeleteRegion({payload},{call}) {
      const response = yield call(deleteRegion,payload);
      return response;
    },
  },

  reducers: {
    saveNewAllRegions(state, { payload }) {
      return {
        ...state,
      };
    },
    saveAllRegions(state, { payload }) {
      return {
        ...state,
        allRegions: payload,
      };
    },
  },
};
