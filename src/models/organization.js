import { getAllOrgan,getUserByOrg,upDateOrganization,getOrgScopeList,
  allAuthList,deleteUserInOrg ,deleteOrg} from '../services/systemSum';
import {filterEmptyChild, getPaginationList} from '../utils/utils';


export default {
  namespace: 'organization',
  state: {
    curOrg: {},
    organList: [],
    userList: {},
    authList:[],//
  },
  effects: {
    *fetchGetOrgScopeList({payload}, {call}){
      const response = yield call(getOrgScopeList, payload);
      if(response.status==='OK') return response;
    },
    *fetchUpdateOrgScope({payload}, {call}){
      const response = yield call(upDateOrganization, payload);
      if(response.status==='OK') return response;
    },
    * fetchGetOrgList({payload}, {call, put}) {
      const response = yield call(getAllOrgan, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveOrgListList',
          payload: {payload, data: response.data},
        });
        return response;
      }
    },
    * fetchGetUserByOrg({payload}, {call, put}) {
      const response = yield call(getUserByOrg, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveUserList',
          payload: {response,lastPayload:payload},
        });
      }
    },
    * fetchGetOrgAuthList({payload}, {call, put}) {
      const response = yield call(allAuthList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveAuthList',
          payload: response.data,
        });
      }
    },
    * fetchDeleteUser({payload}, {call}) {
      const response = yield call(deleteUserInOrg,payload);
      return response;
      },
    * fetchDeleteOrg({payload}, {call}) {
      const response = yield call(deleteOrg,payload);
      return response;
    },
  },
  reducers: {
    saveAuthList(state,{payload}){
    const { list: resourceList } = payload;
    return {
      ...state,
      authList: resourceList,
    }
    },
    saveOrgListList(state, {payload}){
      const organList = payload.data;
      return {
        ...state,
        curOrg: organList[0],
        organList,
      };
    },
    saveUserList(state, {payload}) {
      const { response, lastPayload } = payload
      return {
        ...state,
        curOrg:lastPayload.data,
        userList: getPaginationList(response),
      }
    },
  },
}
