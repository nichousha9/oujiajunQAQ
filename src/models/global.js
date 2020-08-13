import { sendMsg,getAtOutlineInfo } from '../services/api';

const doRefesh = (data) => {
  // 如果当前的是登录页面 或者是 错误页 不用获取用户信息
  if(data.pathname==='/user/login' || data.pathname.indexOf('exception') > -1) return;
  // 每次获取每次存在的数据

}
export default {
  namespace: 'global',

  state: {
    status:undefined,
    owner:{}, // 租户信息
    newMessageAgent:[], // 坐席端的消息
    atMeMsgIdArr:{},// at的信息，
    collapsed: true,// 菜单默认收起
    enterType:'enter',
  },

  effects: {
    *fetchNotices(_, { call, put }) {
        return;
    },
    *clearNotices({ payload }, { put, select }) {
        return;
    },
    *sendMsg({ payload }, { call, put }) {
         const response = yield call(sendMsg, payload);
         yield put({
           type: 'sendMsgRE',
           payload: response,
         });
    },
    *fetchGetAtOutlineInfo({ payload }, { call, put }) {
      const response = yield call(getAtOutlineInfo, payload);
      if(response.status==='OK'){
        const messageArr = response.data || [];
        const atMeOutline = {};
        messageArr.forEach((msg) =>{
          const key = msg.groupid ? 'groupid' : 'usession';
          if(atMeOutline[msg[key]]) {
            atMeOutline[msg[key]].push(msg.id);
          }else{
            atMeOutline[msg[key]] = [msg.id]
          }
        })
        console.log('atMeOutline:',atMeOutline)
        yield put({
          type: 'saveAtMeInf',
          payload:atMeOutline,
        });
      }
      return response;
    },
  },

  reducers: {
      changeEnterType(state,{payload}){
        return {
          ...state,
          enterType: payload.enterType,
        }
      },
      saveAtMeInf(state,{ payload }){
        return {
          ...state,
          atMeMsgIdArr: payload,
        }
      },
      saveOwnerInfo(state,{payload}) {
          // 缓存租户
          let owner = {}
          if(payload){
              owner = { orgid: payload.orgi,tenantname: payload.tenantname};
          }
        return { ...state,owner };
      },
      changeLayoutCollapsed(state, { payload }) {
          return {
            ...state,
            collapsed: payload,
          };
        },
      sendMsgRE(state, { payload }) {
        return {
          ...state,
          status: payload.status,
        };
      },
      changeSideBarBadge(state, {payload}) {
        return {
          ...state,
          hasNewMsg: payload,
        };
      },
      saveNewMessageAgent(state,{payload}){
        return{
          ...state,
          newMessageAgent:payload || [],
        };
      },
  },
  subscriptions: {
    setup({dispatch,history}) {
      history.listen((res) => {
        doRefesh(res,dispatch);
      });
    },
  },
};
