import { message } from 'antd';
import { modifyCurrentInfo, validatePassword,editPassword } from '../services/user';
import {getUserInfo} from '../utils/userInfo';


  export default {
    namespace: 'modifyprofile',

    state: {
        userInfo:{},
        status:undefined,
    },

    effects: {
        *getCurrentInfo(_,{ put }) {
          const response = yield getUserInfo();
          yield put({
            type: 'getCurrentInfoRE',
            payload: response,
          });
        },
        *modifyCurrentInfo({ payload },{ call, put }) {
          const response = yield call(modifyCurrentInfo, payload);
          yield put({
            type: 'modifyCurrentInfoRE',
            payload: response,
          });
          yield put({
            type:'user/updateCurrentUserNoStatus',
            payload: response,
          })
        },
        *fetchValidatePassword({payload},{ call }) {
         const response = yield call(validatePassword,payload);
         return response
       },
      *fetchEditPassword({ payload },{ call }){
        const response = yield call(editPassword,payload);
        return response
      },
    },

    reducers: {
        // 获取当前用户信息
      getCurrentInfoRE(state, { payload }) {
        return {
          ...state,
          userInfo: payload,
        };
      },
      // 修改当前用户信息
    modifyCurrentInfoRE(state, { payload }) {
        const { userInfo } = state;
      if(payload.status==='OK'){
        message.success('修改成功');
      }
      return {
        ...state,
        userInfo:{...userInfo,...payload.data},
        status: payload.status,
      };
    },
  },
}
