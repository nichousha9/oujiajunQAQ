import { getAllUserList,deleteLessUser } from '../services/systemSum';
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'userAccount',

  state: {
    allUserList: [],
  },

  effects: {
    *fetchGetAllUserList({ payload }, { call, put }) {
      const response = yield call(getAllUserList,payload);
      yield put({
        type: 'saveAllUserList',
        payload: getPaginationList(response,payload),
      });
    },
    *fetchDeleteLessUser({ payload }, { call }) {
      const response = yield call(deleteLessUser,payload);
      return response;
     },
    },
  reducers: {
    // 保存用户登录状态
    saveAllUserList(state, {payload}) {
      return {
        ...state,
        allUserList: payload,
      };
    },
  },
};
