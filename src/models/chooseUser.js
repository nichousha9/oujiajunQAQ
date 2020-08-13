import { userChooseListOrg,addUsersToOrg,userChooseListRole,addUsersToRole } from '../services/systemSum';
import {getPaginationList} from '../utils/utils';
import { modifyGroup } from '../services/chatSetting';

export default {
  namespace: 'chooseUser',
  state: {
    userList:[],
  },
  effects: {
    *fetchUserChooseListOrg({ payload }, { call, put }) {
      const response = yield call(userChooseListOrg,payload);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
    },
    *fetchUserChooseListRole({ payload }, { call, put }) {
      const response = yield call(userChooseListRole,payload);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
    },
    *fetchAddUserToOrg({ payload }, { call }) {
      const response = yield call(addUsersToOrg,payload);
      return response;
    },
    *fetchAddUserToRole({ payload }, { call }) {
      const response = yield call(addUsersToRole,payload);
      return response;
    },
    *fetchModifyPublicChat({ payload },{ call}){
      const response = yield call(modifyGroup,payload);
      if(response.status === 'OK'){
        return response;
      }
    },
  },
  reducers: {
    saveUserList(state, {payload}) {
      const userList = getPaginationList(payload)
      return {
        ...state,
        userList,
      };
    },
  },
};
