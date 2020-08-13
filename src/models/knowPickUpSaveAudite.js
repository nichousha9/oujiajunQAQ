import { knowPickUp,knowSubmitToAudit,knowSubmit, getKnowPickUpHisList,knowAudite,cancelAudite} from '../services/kdbPickup';
import { getPaginationList } from '../utils/utils';

export default {
  namespace:'knowPickUpSaveAudite',
  state: {
    editItem:{},// 问题的详细信息
    knowPickUpHisList:{},
  },
  effects: {
    *fetchCancelAudite({payload}, { call }){
      const response = yield call(cancelAudite,payload);
      return response
    },
    *fetchKnowAudite({payload}, { call }){
      const response = yield call(knowAudite,payload);
      return response
    },
    *fetchSaveKnowPickUpDraft({payload}, { call, put }){
      const response = yield call(knowPickUp,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveKnowPickUpDraft',
          payload: response.data,
        })
        return response
      }
    },
    *fetchKnowSubmitToAudit({payload}, { call }){
      const response = yield call(knowSubmitToAudit,payload);
      return response;
    },
    *fetchKnowSubmit({payload}, { call }){
      const response = yield call(knowSubmit,payload);
      return response;
    },
    *fetchGetKnowPickUpHisList({payload}, { call ,put}){
      const response = yield call(getKnowPickUpHisList,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveKnowPickUpHisList',
          payload: response,
        })
        return response
      }
    },
  },

  reducers: {
    saveKnowPickUpHisList(state,{payload}){
      // payload.data.list = payload.data.questionList
      return {
        ...state,
        knowPickUpHisList: getPaginationList({data: payload.data.pageInfo}),
      }
    },
    saveKnowPickUpDraft(state,{payload}){
      return {
        ...state,
        editItem:payload,
      }
    },
  },
}
