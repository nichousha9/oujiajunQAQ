import { getQuickTypes,getQuickreplys,editQuickType,addQuickType,deleteQuickType,
  addQuickReply,editQuickReply,deleteQuickReply} from "../services/api";

export default {
  namespace:'agentQuickReply',
  state:{
    quickReplyList:[],
    quickTypeList: [],
  },
  effects:{
    *fetchGetRelateQuesList({ payload },{ call,put}){
      const types = yield call(getQuickTypes,payload);
      const quickerReplay = yield call(getQuickreplys,payload);
      if(types.status === 'OK' && quickerReplay.status==='OK') {
        yield put({
          type: 'saveQuickerReplay',
          payload: {types: types.data,quickerReplay:quickerReplay.data},
        })
      }
    },
    *fetchEditQuickType({ payload },{ call}){
      const res = yield call(editQuickType,payload);
      if(res.status === 'OK') {
        return res;
      }
    },
    *fetchAddQuickType({ payload },{ call}){
      const res = yield call(addQuickType,payload);
      if(res.status === 'OK') {
        return res;
      }
    },
    *fetchDeleteQuickType({ payload },{ call}){
      const res = yield call(deleteQuickType,payload);
      return res;
    },
    *fetchAddQuickReply({ payload },{ call}){
      const res = yield call(addQuickReply,payload);
      return res;
    },
    *fetchEditQuickReply({ payload },{ call}){
      const res = yield call(editQuickReply,payload);
      return res;
    },
    *fetchDeleteQuickReply({ payload },{ call}){
      const res = yield call(deleteQuickReply,payload);
      return res;
    },
  },
  reducers:{
    clearState(state){
      return {
        ...state,
        quickReplyList:[],
        quickTypeList: [],
      }
    },
    saveQuickerReplay(state, { payload }){
      const { types=[], quickerReplay =[]} = payload;
      // 遍历获取数据分类
      for(const cate of types){
        cate.replys = []
        for(const item of quickerReplay){// 匹配分类
          if(item.cate === cate.id) cate.replys.push(item)
        }
      }
      return{
        ...state,
        quickReplyList:quickerReplay,
        quickTypeList: types,
      }
    },
  },
}
