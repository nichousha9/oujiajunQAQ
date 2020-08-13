import { getSceneIntentionTest,getSimpleSceneList } from "../services/sceneApiList";
import { getPaginationList } from '../utils/utils'

export default {
  namespace: 'sceneIntentionTest',
  state: {
    sceneIntentionTestList: {}, // 场景意图测试表
    simpleSceneList:[],
  },
  effects: {
    // 保存意图快速回复
    *fetchSaveSceneIntentionTestList({payload}, {call, put}){
      const res = yield call(getSceneIntentionTest, payload);
      if(res.status==='OK'){
        yield put({
          type: 'saveSceneIntentionTestList',
          payload: res,
        });
      }
      return res;
    },
    // 保存意图快速回复
    *fetchGetSimpleSceneList({payload}, {call, put}){
      const res = yield call(getSimpleSceneList, payload);
      if(res.status==='OK'){
        yield put({
          type: 'saveSimpleSceneList',
          payload: res.data || [],
        });
      }
      return res;
    },

  },
  reducers: {
    saveSimpleSceneList(state,{payload}){
      return {
        ...state,
        simpleSceneList: payload,
      };
    },
    saveSceneIntentionTestList(state, {payload}){
      return {
        ...state,
        sceneIntentionTestList: getPaginationList(payload),
      };
    },
    clearState(){
      return {
        sceneIntentionTestList:{},
      }
    },
  },
}
