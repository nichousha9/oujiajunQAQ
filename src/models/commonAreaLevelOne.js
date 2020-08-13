import { getAllAreaList } from '../services/systemSum';
import {arrayToTree} from "../utils/utils";


export default {
  namespace:'commonAreaLevelOne',
  state:{
    areaLevelOneList:[], // 第一层级的地区，
    allAreaList:[], // 所有地区，
  },
  effects:{
    *fetchGetAreaLevelOneList({ payload }, { call, put }){
      const response = yield call(getAllAreaList, payload);
      if (response.status==='OK') {
        yield put({
          type: 'saveAreaLevelOneList',
          payload: response.data,
        });
      }
    },
    *fetchGetAllAreaList({ payload }, { call, put }){
      const response = yield call(getAllAreaList, payload);
      if (response.status==='OK') {
        yield put({
          type: 'saveAllAreaList',
          payload: arrayToTree(response.data,'regionid','parentid'),
        });
      }
    },
  },
  reducers:{
    saveAreaLevelOneList(state,{payload}){
      return{
        ...state,
        areaLevelOneList:payload,
      }
    },
    saveAllAreaList(state,{payload}){
      return{
        ...state,
        allAreaList:payload,
      }
    },
  },
}
