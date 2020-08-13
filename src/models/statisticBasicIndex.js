import { getPaginationList, getTodayStartEndTime } from '../utils/utils';
import { getAllOrgan} from "../services/systemSum";
import {getUserInfo} from '../utils/userInfo';

export default {
  namespace: 'statisticBasicIndex',

  state: {
    skillid:'',// 客服组、技能组id
    skillUser:'',// 客服组、技能组id的用户
    channel:'',// 渠道
    agentno:'', // 客服
    starttime:'', // 开始时间
    endtime:'', // 结束时间
    status:0,// 标志当前的图的按时间还是按日期；
    ...getTodayStartEndTime(),
    curUserOrganList:[],
    organid:'',// 选中组织ID
  },

  effects: {
    *getUserOrganTree({ payload },{ call, put }){
      const response = yield call(getAllOrgan, {parent: 0});
      if(response.status==='OK'){
        yield put({
          type: 'saveUserOrganTree',
          payload: response.data || [],
        });
      }
    },
  },

  reducers: {
    saveSaticBasic(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
    saveUserOrganTree(state,{payload}){
      return {
        ...state,
        curUserOrganList: payload,
      }
    },
    clearSaticBasicIndex(state){
      return {
        ...state,
        skillid:'',// 客服组、技能组id
        skillUser:'',// 客服组、技能组id的用户
        channel:'',// 渠道
        agentno:'', // 客服
        starttime:'', // 开始时间
        endtime:'', // 结束时间
        status:0,// 标志当前的图的按时间还是按日期；
        ...getTodayStartEndTime(),
        organid:'',
      }
    },
  },
};
