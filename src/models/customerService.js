import { agentStatistical } from  '../services/statistics';
import { getPaginationList } from  '../utils/utils';

export default {
  namespace: 'customerService',

  state: {
    agentList:{},
  },

  effects: {
    *fetchAgentStatistical({payload}, { call, put }) {
      const response = yield call(agentStatistical,payload);
      if(response.status === 'OK'){
        yield put({
          type:'saveAgentList',
          payload: response,
        })
      }
    },
  },

  reducers: {
    saveAgentList(state,{ payload }){
      return {
        ...state,
        agentList: getPaginationList(payload),
      }
    },
  },
};
