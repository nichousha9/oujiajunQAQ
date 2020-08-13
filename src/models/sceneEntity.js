import {getEntityList,getSysEntityList,saveEntity,deleteEntity} from "../services/sceneApiList";
import {getPaginationList} from '../utils/utils';

export default {
  namespace: 'sceneEntity',
  state: {
    sceneEntityList: [], // 场景实体
    sysEntityList:[], // 系统实体
  },
  effects: {
    *fetchSceneEntityList({payload}, {call, put}){
      const response = yield call(getEntityList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'getSceneEntityList',
          payload: obj,
        });
      }
    },

    *fetchSceneSysEntityList({payload}, {call, put}){
      const response = yield call(getSysEntityList, payload);
      if (response.status === 'OK') {
        const obj = response.data;
        yield put({
          type: 'getSysEntityList',
          payload: obj,
        });
      }
    },

    *fetchSaveSceneEntity({payload}, {call}){
      const res = yield call(saveEntity, payload);
      return res;
    },

    *fetchDeleteSceneEntity({payload}, {call}){
      yield call(deleteEntity, payload);
    },

  },
  reducers: {
    getSceneEntityList(state, {payload}){
      return {
        ...state,
        sceneEntityList: payload,
      };
    },

    getSysEntityList(state, {payload}){
      return {
        ...state,
        sysEntityList: payload,
      };
    },
  },
}
