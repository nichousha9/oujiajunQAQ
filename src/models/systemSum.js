import {
  allAuthList,
  // getOrgClass,
  organAuthList,
} from '../services/systemSum';
import { arrayToTree } from '../utils/utils';

export default {
  namespace: 'systemSum',
  state: {
    resourceList: [], // 角色的所有权限的list
    orgClassList: [], // 组织级别list
    orgAuthList: [], // 组织权限列表
  },
  effects: {
    *fetchGetAllAuthList({ payload }, { call, put }) {
      const response = yield call(allAuthList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveAllAuthList',
          payload: response.data,
        });
      }
    },
    // 组织权限和角色权限一样暂时就不用了
    *fetchOrganAuthList({ payload }, { call, put }) {
      const response = yield call(organAuthList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveOrganAuthList',
          payload: response.data,
        });
      }
    },
    // *fetchOrgClassList({ payload }, { call, put }){
    //   const response = yield call(getOrgClass,payload);
    //   if(response.status==='OK'){
    //     yield put({
    //       type: 'fetchOrgClassListRD',
    //       payload: response.data,
    //     });
    //   }
    // },
  },
  reducers: {
    saveAllAuthList(state, { payload }) {
      const { list: resourceList } = payload;
      return {
        ...state,
        resourceList: arrayToTree(resourceList, 'id', 'parentid'),
      };
    },
    saveOrganAuthList(state, { payload }) {
      const { resourceList } = payload;
      return {
        ...state,
        orgAuthList: arrayToTree(resourceList, 'id', 'parentid'),
      };
    },
    fetchOrgClassListRD(state, { payload }) {
      return {
        ...state,
        orgClassList: payload,
      };
    },
  },
};
