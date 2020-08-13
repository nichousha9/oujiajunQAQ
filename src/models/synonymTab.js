import { getStandardWordList, standardWordSave} from "../services/api";
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'synonymTab',
  state: {
    standardWordList: [] , // 标准问题
  },
  effects:{
    *fetchStandardWordList({ payload },{ call, put }){
      const response = yield call(getStandardWordList, payload);
      if(response.status==='OK'){
        const obj = getPaginationList(response);
        yield put({
          type: 'getStandardWordList',
          payload: obj,
        });
      }
    },
    *fetchSaveStandardWord({ payload },{ call }){
      yield call(standardWordSave, payload);
    },
  },
  reducers: {
    getStandardWordList(state, { payload }){
      return {
        ...state,
        standardWordList: payload,
      };
    },
  },
}
