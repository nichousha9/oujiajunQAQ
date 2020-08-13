import { getPaginationList } from '../utils/utils';
import { deleteGroup, addNewGroup,modifyGroup,getGroupMemberPage, getPublicGroup } from '../services/chatSetting';

export default {
  namespace: 'publicchat',

  state: {
    publicGroupList: [],
    currGroup:'',
    groupUserList:{},
  },

  effects: {
    *fetchAllPublicGroup({ payload }, { call, put }) {
      const response = yield call(getPublicGroup, payload);
      yield put({
        type: 'fetchAllPublicGroupRP',
        payload:  response.data || [],
      });
      if(response.status==="OK") return response;
    },
    *fetchGroupMemberPage({ payload }, { call, put }) {
      const response = yield call(getGroupMemberPage, payload);
      yield put({
        type: 'fetchGroupMemberPageRP',
        payload:  { payload: response.data || [], lastPayload: payload},
      });
      if(response.status==="OK") return response;
    },
    *fetchModifyPublicChat({ payload },{ call}){
      const response = yield call(modifyGroup,payload);
      if(response.status === 'OK'){
        return response;
      }
    },
    *fetchAddPublicChat({ payload },{ call}){
      const response = yield call(addNewGroup,payload);
      if(response.status === 'OK'){
        return response;
      }
    },
    *deletePublicChat({ payload },{ call}){
      const response = yield call(deleteGroup,payload);
      if(response.status === 'OK'){
        return response;
      }
    },
  },

  reducers: {
    clearState(state){
      return {
        ...state,
        publicGroupList:[],
        currGroup:'',
        groupUserList:{},
      }
    },
    fetchAllPublicGroupRP(state, {payload}) {
      (payload || []).map((group) =>{
        group['name'] = group.groupname;
        group['type'] = '';
      });
      return {
        ...state,
        publicGroupList: payload,
        currGroup:(payload[0] || {}).id,
      };
    },
    fetchGroupMemberPageRP(state, {payload}) {
      const { payload: {groupUserList },lastPayload} = payload;
      return {
        ...state,
        currGroup:lastPayload.groupid,
        groupUserList: getPaginationList({data:groupUserList},lastPayload),
      };
    },
  },
};
