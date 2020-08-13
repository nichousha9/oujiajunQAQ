import { getDataDicByType,getKnowledgeType,getRelateQues,getKdbPickUpCateList, getUserKdbList } from '../services/api';
import {getAllOrgan,getCurUserArea} from "../services/systemSum";


export default {
  namespace: 'dataDic',

  state: {
    dataDic:{},
  },

  effects: {
    *fetchGetKdbCateList(_, { call, put }){
      // 仅用于知识收录
      const kdbList = yield call(getUserKdbList); // 获取用户的Kdb
      if(kdbList && kdbList.status === 'OK'){
        const kdbId = ((kdbList.data || [])[0] || {}).id || '';
        const cateAllList = yield call(getKdbPickUpCateList, {kdbid: kdbId }); // 获取用户的Kdb
        if(cateAllList && cateAllList.status === 'OK'){
          yield put({
            type:'saveDataDicByType',
            payload:{ type:'cateAllList',data:cateAllList.data || []} ,
          })
          yield put({
            type:'saveDataDicByType',
            payload:{ type:'kdbid',data:kdbId} ,
          })
        }
      }
    },
    *fetchFetDataDicByType({ payload }, { call, put }) {
      const { type } = payload;
      const response = yield call(getDataDicByType, payload);
      if(response.status === 'OK'){
        yield put({
          type: 'saveDataDicByType',
          payload: { type,data:response.data},
        });
      }
    },
    *fetchGetOrgList({payload}, {call, put}) {
      const response = yield call(getAllOrgan, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveDataDicByType',
          payload: {type:'organList', data: [response.data.organList]},
        });
        return response;
      }
    },
    // 当前用户所在部门树
    *fetchGetCurUserAreaList({payload ={}}, {call, put}) {
      const { type,parentId} = payload
      const response = yield call(getCurUserArea,payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveDataDicByType',
          payload: {type:`curUserAreaList${type}`,parentId,data: response.data || []},
        });
        return response;
      }
    },
    *fetchGetKnowledgeType({ payload }, { call, put }){
      const response = yield call(getKnowledgeType, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveDataDicByType',
          payload: {type:'knowledgeType', data: response.data},
        });
        return response;
      }
    },
    *fetchGetRelateQues({payload},{call, put}){
      const response = yield call(getRelateQues, payload);
      if(response.status === 'OK'){
        yield put({
          type: 'saveDataDicByType',
          payload: { type:'relateQuesList',data: response.data},
        });
      }
    },
  },

  reducers: {
    clearRegion(state){
      const { dataDic ={} } = state;
      const curType = 'curUserAreaListcommon_region_type_kdbPickup';
      const type = 'curUserAreaListcommon_region_type_kdb';
      const obj = {};
      obj[curType] = [];
      obj[type] = [];
      return {
        ...state,
        dataDic:{...dataDic,...obj},
      }
    },
    clearState(state){
      return {
        ...state,
        dataDic:{},
      }
    },
    saveDataDicByType(state,{ payload }) {
      const { type,data } = payload;
      const { dataDic } = state;
      const obj = {};
      obj[type] = data;
      return { ...state,dataDic:{ ...dataDic,...obj} };
    },
  },
};
