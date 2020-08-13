import { getAllRoleList,getRoleListByRole,deleteRole,
  deleteRoleUser,updateRole,saveRole} from '../services/systemSum';
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'systemRole',
  state: {
    currRole:'',
    roleList:[],
    userRoleList:{},
  },
  effects: {
    *fetchGetAllRoleList({ payload }, { call, put }) {
      const response = yield call(getAllRoleList,payload);
      yield put({
        type: 'saveAllRoleList',
        payload: { payload: response.data || {}},
      });
      if(response.status==="OK") return response;
    },
    *fetchGetRoleListByRole({ payload }, { call, put }) {
      const response = yield call(getRoleListByRole,payload);
      yield put({
        type: 'updateUserRoleList',
        payload: { payload: response.data || {}, lastPayload: payload},
      });
    },
    *fetchDeleteRole({ payload }, { call, put }){
      const response = yield call(deleteRole,payload);
      yield put({
        type: 'deleteUpdateRole',
        payload,
      });
      return response;

    },
    *fetchDeleteRoleUser({ payload }, { call }){
      const response = yield call(deleteRoleUser,payload);
      return response;
    },
    *fetchUpdateRole({ payload }, { call,put }){
      const response = yield call(payload.id ? updateRole : saveRole,payload);
      if(response.status==='OK'){
        yield put({
          type: payload.id ? 'updateRole' : 'saveRole',
          payload: payload.id ? payload : response,
        });
      }
      return response;
    },
  },
  reducers: {
    saveAllRoleList(state, {payload}) {
      const { payload: { list: roleList }} = payload;
      return {
        ...state,
        currRole:(roleList[0] || {}).id,
        roleList,
      };
    },
    updateUserRoleList(state, {payload}){
      const { payload: {userList },lastPayload} = payload;
      return {
        ...state,
        currRole:lastPayload.id,
        userRoleList:getPaginationList({data:userList},lastPayload),
      };
    },
    deleteUpdateRole(state,{payload}){
      const { roleList } = state;
      const newRoleList = roleList.filter((role) => {
        return role.id!==payload.id;
      });
      return {
        ...state,
        roleList:newRoleList,
      }
    },
    updateRole(state,{payload}){
      const { roleList } = state;
      const newRoleList = roleList.map((role) => {
        if(role.id === payload.id){
          return {
            ...role,
            name:payload.name,
          }
        }
        return role;
      });
      return {
        ...state,
        roleList:newRoleList,
      }
    },
    saveRole(state,{payload}){
      const { roleList } = state;
      const newRoleList = [payload.data,...roleList];
      return {
        ...state,
        roleList:newRoleList,
      }
    },
  },
};
