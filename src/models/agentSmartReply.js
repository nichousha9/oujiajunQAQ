import { getRelateQues} from "../services/api";

export default {
  namespace:'agentSmartReply',
  state:{
    relateQuesList:[], // 相关问题列表；
  },
  effects:{
    *fetchGetRelateQuesList({ payload },{ call,put}){
      const response = yield call(getRelateQues,payload);
      if(response.status === 'OK') {
        yield put({
          type: 'saveRelateQuesList',
          payload: response.data,
        })
      }
    },
  },
  reducers:{
    saveRelateQuesList(state, { payload }){
      return{
        ...state,
        relateQuesList: payload,
      }
    },
  },
}
