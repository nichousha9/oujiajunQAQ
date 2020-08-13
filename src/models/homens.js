import { getHomePageDate,getAgentList, getOnlineUserList,getAllAgentList,
  getSummeryByTime, getMostUsedQuestion, getUnsolvedQuestionTop, exportUnsolvedQuestion, getSonDicsByCode
  }
  from '../services/api';
import { getPaginationList } from '../utils/utils';

  export default {
    namespace: 'homens',
    state: {
        onLineUserList:{},
        agentList:{},
        unsolvedQuestionList:{
          list: [],
          pagination: {},
        }, // 未解决的问题
        mostUsedQuestionList:{}, // 热门问题
        summeryData:{}, // 机器人的概要信息
    },
    effects: {
        *fetchSummeryByTime({ payload }, { call, put}){
          const response = yield call(getSummeryByTime, payload);
          if(response.status === "OK"){
            yield  put({
              type:'saveSummery',
              payload: response.data,
            });
          }
        },
        *fetchGetOnlineUserList({ payload },{ call,put }){
          const response = yield call(getOnlineUserList, payload);
          if(response.status === "OK"){
           yield  put({
              type:'saveOnLineUser',
              payload: response,
           });
          }
          return response;
        },
        *fetchGetAgentList({ payload },{ call,put }){
        const response = yield call(getAgentList, payload);
        if(response.status === "OK"){
          yield  put({
            type:'saveAgentList',
            payload: response,
          });
        }
        },
          *fetchGetMostUsedQuestion({ payload },{ call,put }){
          const response = yield call(getMostUsedQuestion, payload);
          if(response.status === "OK"){
            yield  put({
              type:'saveMostUsedQuestionList',
              payload: response,
            });
          }
        },
        *fetchGetUnsolvedQuestionList({ payload },{ call,put }){
          const response = yield call(getUnsolvedQuestionTop, payload);
          if(response.status === "OK"){
            yield  put({
              type:'saveUnsolvedQuestionList',
              payload: response,
            });
          }
        },
        *loadData({payload}, { call, put }) {
          const response = yield call(getHomePageDate, payload);
          yield put({
            type: 'loadHomeData',
            payload: response,
          });
        },
        *getAgentList({payload}, { call, put }) {
          const response = yield call(getAllAgentList, payload);
          yield put({
            type: 'agentList',
            payload: response,
          });
        },
        *exportUnsolvedQuestion({payload}, { call, put }){
          const response = yield call(exportUnsolvedQuestion, payload);
          yield put({
            type: 'exportUnsolvedQuestionRP',
            payload: response,
          });
        },
        *getSonDicsByCode({payload}, { call }){
          const response = yield call(getSonDicsByCode, payload);
          return response;
        },
    },

    reducers: {
      saveUnsolvedQuestionList(state,{payload}){
        // console.log(payload);
        const mostUnUsedQuestionList = payload.data.content ||[];
        const total = Number((payload.data.otherInfo || {}).totalSearch || 100);
        const isFixedTo2 = function(number) {
          if(!number) return number;
          const arr = `${number}`.split('.');
          if(arr.length>1 && arr[1].length>2) return number.toFixed(2);
          return number;
        }
        let curTotal = 0;
        let others = '';
        mostUnUsedQuestionList.forEach(item => {
          curTotal += item.total;
        });
        const newList = mostUnUsedQuestionList.map((item)=>{
          return {
            ...item,
            number:item.total,
            rate:isFixedTo2(item.total/curTotal*100),
          }
        })
        if(curTotal < total){
          others = {
            question:'其它',
            number: total - curTotal,
            total: total - curTotal,
            rate:isFixedTo2((total - curTotal)/total*100),
            id:'others',
          }
        }
        return {
          ...state,
          mostUnUsedQuestionList:{list:newList,others},
          //  mostUsedQuestionList: getPaginationList(payload),
        }
      },
      saveMostUsedQuestionList(state,{payload}){
        // console.log(payload);
        const mostUsedQuestionList = payload.data.content ||[];
        const total = Number((payload.data.otherInfo || {}).totalSearch || 100);
        const isFixedTo2 = function(number) {
          if(!number) return number;
          const arr = `${number}`.split('.');
          if(arr.length>1 && arr[1].length>2) return number.toFixed(2);
          return number;
        }
        let curTotal = 0;
        let others = '';
        mostUsedQuestionList.forEach(item => {
          curTotal += item.total;
        });
        const newList = mostUsedQuestionList.map((item)=>{
          return {
            ...item,
            number:item.total,
            rate:isFixedTo2(item.total/curTotal*100),
          }
        })
        if(curTotal < total){
          others = {
            question:'其它',
            number: total - curTotal,
            total: total - curTotal,
            rate:isFixedTo2((total - curTotal)/total*100),
            id:'others',
          }
        }
        return {
          ...state,
          mostUsedQuestionList:{list:newList,others},
          //  mostUsedQuestionList: getPaginationList(payload),
        }
      },
      saveAgentList(state,{payload}){
        return {
          ...state,
          agentList: getPaginationList(payload),
        }
      },
      saveOnLineUser(state, {payload}){
        return {
          ...state,
          onLineUserList: getPaginationList(payload),
        }
      },
      saveSummery(state, { payload }){
        return {
          ...state,
          summeryData: payload,
        }
      },
      // 加载首页数据
    loadHomeData(state, { payload }) {
        const data = payload.data;
      return {
        ...state,
        data,
      };
    },
    // 加载客服列表
    agentList(state, { payload }) {
        return {
          ...state,
          agentList:payload.data,
        };
      },
      // 导出未解决问题
      exportUnsolvedQuestionRP(state, { payload }) {
        // console.log(payload);
        return {
          ...state,
        };
      },
    },
  };
