import { getOnlineUsers,transferAgent2Group, transferAgent} from "../services/api";
import { getPaginationList } from '../utils/utils'


export default {
  namespace: 'transfer',

  state: {
    curTransferUser:{},
    skillOnlineUser: [],
  },

  effects: {
    *fetchTransferAgent({ payload }, { call }){
      const response = yield call(transferAgent,payload);
      return response;
    },
    *fetchTransferOrg({ payload }, { call }){
      const response = yield call(transferAgent2Group,payload);
      return response;
    },
    *fetchSkillOnlineUserList({ payload }, { call, put }) {
      const response = yield call(getOnlineUsers,payload);
      yield put({
        type: 'saveSkillOnlineUser',
        payload: getPaginationList(response,payload,true),
      });
    },
  },

  reducers: {
    saveSkillOnlineUser(state, {payload}) {
      return {
        ...state,
        skillOnlineUser: payload,
      };
    },
    updateCurTransferUser(state,{payload}){
      return {
        ...state,
        curTransferUser:payload || {},
      }
    },
  },
};
