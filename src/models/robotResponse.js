import { robotStatistical } from  '../services/statistics';

export default {
  namespace: 'robotResponse',

  state: {
    graphData:[],// 图片数据
    statisticalData:{}, // 统计数据
    status:'',// 标志当前的图的按时间还是按日期；
  },

  effects: {
    *fetchRobotStatistical({payload}, { call, put }) {
      const response = yield call(robotStatistical,payload);
      if(response.status === 'OK'){
        yield put({
          type:'saveRobotList',
          payload: response.data,
        })
      }
    },
  },

  reducers: {
    saveRobotList(state,{ payload }){
      return {
        ...state,
        ...payload,
      }
    },
  },
};
