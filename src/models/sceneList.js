import {getSceneList, saveScene,setAbleScene,deleteScene,reloadBotScene} from "../services/api";
import {getPaginationList} from '../utils/utils';

export default {
  namespace: 'sceneList',
  state: {
    sceneList: {}, // 场景列表
  },
  effects: {
    *fetchSceneList({payload}, {call, put}){
      const response = yield call(getSceneList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'saveSceneList',
          payload: obj,
        });
     }
    },
    *fetchSetAbleScene({payload},{call}){
      const res = yield call(setAbleScene,payload);
      if(res.status==='OK') return res;
    },
    *fetchSaveScene({payload}, {call}){
      const res = yield call(saveScene, payload);
      if(res.status==='OK') return res;
    },
    *fetchDeleteScene({payload}, {call}){
      const res = yield call(deleteScene, payload);
      if(res.status==='OK') return res;
    },
    *fetchReloadBotScene({payload}, {call}){
      const res = yield call(reloadBotScene, payload);
      return res;
    },
  },
  reducers: {
    saveSceneList(state,{payload}){
      return {
        ...state,
       sceneList: payload,
      /* sceneList: {
          list: [
            {
              id: 1,
              word: 'name11',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '1',
            }, {
              id: 2,
              word: 'name12',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '1',
            }, {
              id: 3,
              word: 'name13',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '0',
            }, {
              id: 4,
              word: 'name14',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '0',
            }, {
              id: 5,
              word: 'name15',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '1',
            }, {
              id: 6,
              word: 'name16',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '1',
            }, {
              id: 7,
              word: 'name17',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '0',
            }, {
              id: 8,
              word: 'name18',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '1',
            }, {
              id: 9,
              word: 'name19',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '0',
            },
          ],
          pagination: {pageSize: 10, current: 1, totalPages: 1, total: 9},
        }, */
      };
    },
  },
}
