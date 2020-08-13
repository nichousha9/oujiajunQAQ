import { agentstatusUpdate, getClassifySkillList } from '../services/api';
import { getSkillGroupUser,getUserGroup,addNewGroup,modifyGroup,getGroupMember } from '../services/chatSetting';
import {getAllOrgan} from "../services/systemSum";

export default {
    namespace: 'agentstatusUpdate',

    state: {
        list: [],
        userGroups:[], // 当前用户的讨论组
        groupSkillList:[], // 分组的技能列表
        skillUserList:{},
        selectedGroupUser:[], // 当前的选中的讨论组成员，
        organList:[],
    },
    effects: {
        *fetchGetAllOrgan({ payload },{ call,put}){
          const response = yield call(getAllOrgan,payload);
          if(response.status === 'OK'){
            yield put({
              type:'saveOrganList',
              payload:[(response.data || {}).organList ],
            })
            return response;
          }
        },
       *fetchGetGroupMember({ payload },{ call,put}){
         const response = yield call(getGroupMember,payload);
         if(response.status === 'OK'){
           yield put({
             type:'saveSelectGroupUser',
             payload:{selectedGroupUser:response.data},
           })
           return response;
         }
       },
       *fetchModifyGroup({ payload },{ call}){
         const response = yield call(modifyGroup,payload);
         return response;
       },
       *fetchAddNewGroup({ payload },{ call}){
         const response = yield call(addNewGroup,payload);
         return response;
       },
        *fetchGetUserGroups(_,{ call, put}){
          const response = yield call(getUserGroup);
          if(response.status === 'OK'){
            yield put({
              type: 'saveUserGroups',
              payload: response.data,
            });
          }
        },
        *fetchGetSkillGroupUser({payload},{ call, put}){
          const response = yield call(getSkillGroupUser,payload);
          if(response.status === 'OK'){
/*            yield put({
              type: 'saveGroupSkillUsers',
              payload: { data: response.data,key:payload.keyword},
            });*/
            return response.data;
          }
        },
        *fetchGetGroupSkillList(_,{ call, put}){
          const response = yield call(getClassifySkillList);
          if(response.status ==='OK')
          {
            yield put({
              type: 'saveGroupSkillList',
              payload: response.data,
            });
          }
        },
        *fetchList(_, { call, put }) {
            const response = yield call(agentstatusUpdate);
            yield put({
                type: 'saveList',
                payload: Array.isArray(response) ? response : [],
            });
        },
    },

    reducers: {
        saveOrganList(state,{payload}){
          return {
            ...state,
            organList: payload,
          }
        },
        saveList(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
       saveGroupSkillList(state,{ payload }){
         return {
           ...state,
           groupSkillList: payload,
         };
      },
      saveGroupSkillUsers(state,{ payload }){
        const { data =[],key} = payload;
        const { skillUserList } = state;
        return {
          ...state,
          skillUserList: {...skillUserList},
        };
      },
      saveSelectGroupUser(state,{payload}){
        // 要把选中的用户进行去重
        const obj ={};
        const Arr =[]
        payload.selectedGroupUser.forEach((item) => {
          if(!obj[item.id]){
            obj[item.id] = true;
            Arr.push(item)
          }
        })
        return {
          ...state,
          selectedGroupUser:Arr,
        }
      },
      saveUserGroups(state,{payload}){
        return {
          ...state,
          userGroups:payload,
        }
      },
      clearState(state){
          return{
            ...state,
            userGroups:[],// 当前用户讨论组清空
            selectedGroupUser:[], // 选中的用户清空
            groupSkillList:[], // 当前的技能清空
          }
      },
    },
};
