import {getSceneDialogList, setAbleSceneDialog,saveSceneDialog,deleteSceneDialog} from "../services/api";
import {getPaginationList} from '../utils/utils';

export default {
  namespace: 'sceneDialog',
  state: {
    sceneDialogList: {}, // 标准问题
  },
  effects: {
    *fetchSetAbleSceneDialog({payload}, {call}){
      const response = yield call(setAbleSceneDialog, payload);
      if(response.status==='OK') return response;
    },
    *fetchDeleteSceneDialog({payload}, {call}){
      const response = yield call(deleteSceneDialog, payload);
      if(response.status==='OK') return response;
    },
    *fetchSceneDialogList({payload}, {call, put}){
      const response = yield call(getSceneDialogList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'saveSceneDialogList',
          payload: obj,
        });
      }
    },
    *fetchSaveScene({payload}, {call}){
      yield call(saveSceneDialog, payload);
    },
  },
  reducers: {
    saveSceneDialogList(state,{payload}){
      return {
        ...state,
        sceneDialogList: payload,
/*        sceneDialogList: {
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
            }, {
              id: 10,
              word: 'name20',
              synonmylist: 'name1name1name1name1name1name1name1name1name1name1',
              isenable: '0',
            },
          ],
          pagination: {pageSize: 5, current: 1, totalPages: 20, total: 98}
        },*/
      };
    },
  },
}
