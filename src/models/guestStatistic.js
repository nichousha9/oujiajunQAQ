import { agentuserStatistical,agentLabelStatistical,agentRegionStatistical} from '../services/statistics';

export default {
  namespace:'guestStatistic',
  state : {
    agentLabelList:[],// 用户的标签
    guestGraphData: [],
    guestStatisticInfo: {},
    agentRegionList:[],// 用户的地区；
    status,
  },
  effects:{
    *fetchAgentuserStatistical({payload}, { call, put }){
      const response = yield call(agentuserStatistical,payload);
      if(response.status === 'OK'){
        yield put({
          type:'saveAgentUserInfo',
          payload:response,
        })
      }
    },
    *fetchAgentLabelStatistical({payload},{call,put}){
      const response = yield call(agentLabelStatistical,payload);
      if(response.status === 'OK'){
        yield put({
          type:'saveAgentLabel',
          payload:response.data,
        })
      }
    },
    *fetchAgentRegionStatistical({payload},{ call, put}){
      const response = yield call(agentRegionStatistical,payload);
      if(response.status === 'OK'){
        yield put({
          type:'saveAgentRegion',
          payload:response.data,
        })
      }
    },
  },
  reducers:{
    saveAgentRegion(state,{ payload }){
      return {
        ...state,
        agentRegionList: payload,
      }
    },
    saveAgentLabel(state,{ payload }){
      return{
        ...state,
        agentLabelList: payload,
      }
    },
    saveAgentUserInfo(state,{ payload }){
      const { graphData=[],statisticalData={},status}  = payload.data;
      return {
        ...state,
        status,
        guestGraphData: graphData || [],
        guestStatisticInfo: statisticalData || {},
      }
    },
  },
}
