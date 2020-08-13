import { getTodayStartEndTime, getPaginationList } from '../utils/utils';
import {comChildOrgDetail, comGraphicSummary, comOrganSummary, comUserSummary} from '../services/statistics';

export default {
  namespace: 'communication',

  state: {
    skillid:'',// 客服组、技能组id
    skillUser:'',// 客服组、技能组id的用户
    channel:'',// 渠道
    agentno:'', // 客服
    starttime:'', // 开始时间
    endtime:'', // 结束时间
    status:0,// 标志当前的图的按时间还是按日期；
    ...getTodayStartEndTime(),
    orgSummaryInfo:{},// 部门概况-信息
    orgSumGraphInfo:{},// 部门概况-折线图信息
    childOrgDetailList:[],// 概况-子部门明细列表
    userSummaryInfoList:[],// 用户情况-明细列表
  },

  effects: {
    *fetchComChildOrgDetail({ payload }, { call, put }){
      const response = yield call(comChildOrgDetail,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveComChildOrgDetail',
          payload: {response,lastPayload:payload},
        });
      }
    },
    *fetchComGraphicSummary({ payload }, { call, put }){

      const response = yield call(comGraphicSummary,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveComGraphicSummary',
          payload: response.data,
        });
      }
    },*fetchComOrganSummary({ payload }, { call, put }){
      const response = yield call(comOrganSummary,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveComOrganSummary',
          payload: response.data,
        });
      }
    },
    *fetchComUserSummary({ payload }, { call, put }){
      const response = yield call(comUserSummary,payload);
      if(response.status==='OK'){
        yield put({
          type: 'saveComUserSummary',
          payload: {response,lastPayload:payload},
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
      }
    },
    saveComChildOrgDetail(state, { payload }) {
      const { response, lastPayload}  = payload;
      return {
        ...state,
        childOrgDetailList:getPaginationList(response,lastPayload),
      };
    },
    saveComGraphicSummary(state, { payload }) {
      return {
        ...state,
        orgSumGraphInfo:payload,
      };
    },
    saveComOrganSummary(state, { payload }) {
      return {
        ...state,
        orgSummaryInfo:payload,
      };
    },
    saveComUserSummary(state, { payload }) {
      const { response, lastPayload}  = payload;
      return {
        ...state,
        userSummaryInfoList:getPaginationList(response,lastPayload),
      };
    },

  },
};
