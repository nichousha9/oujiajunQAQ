import { routerRedux } from 'dva/router';
import { changeStatus } from '../services/user';
import {getUserInfo,getUserMenu} from '../utils/userInfo';
import { filterMenu,isSubMenu } from '../utils/utils'

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { put }) {
      const response = yield getUserInfo();
      if (!Object.keys(response).length) {
        yield put(routerRedux.push('/user/login'));
        return
      }
      const menuData = yield getUserMenu();
      const pathname = location.hash.split('#')[1]
      const { roleAuthMap } = response
      const newMenuArr = filterMenu(menuData,'authId',roleAuthMap);
      const sunmenu = isSubMenu(pathname,newMenuArr,roleAuthMap)
      
      const menuPaths = newMenuArr.map(v => v.path)
      if (menuPaths.indexOf(pathname) === -1 && !sunmenu) {
        yield put(routerRedux.push('/user/login'));
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
    *changeStatus({ payload },{ call, put }){
        const response = yield call(changeStatus, payload);
        response.on = payload.status;
        yield put({
          type: 'changeStatusRE',
          payload: response,
        });
    },
    *setCurrStatus({ payload },{ call, put }){
        yield put({
          type: 'changeStatusRE',
          payload: {status:'OK', on: payload.status || 'ready'},
        });
    },
    *changeCurUser({ payload },{  put }){
      yield put({
        type: 'saveChangeCurUser',
        payload,
      });
    },
  },

  reducers: {
    // 保存改变用户信息那里改变得用户信息
    saveChangeCurUser(state, {payload}) {
    return {
      ...state,
      currentUser: payload,
    };
  },
    // 保存用户登录状态
    saveCurrentUser(state, {payload}) {
        const userInfo = payload.data ? payload.data : getUserInfo();
      return {
        ...state,
        currentUser: userInfo,
      };
    },
    // 用户状态切换
    changeStatusRE(state, action) {
        const userInfo = getUserInfo();
        if(action.payload && action.payload.status==='OK'){
            // 由于以前用户没有头像，这里默认赋予一个
            //  userInfo.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
            userInfo.status = action.payload.on;
        }
      return {
        ...state,
        currentUser: userInfo,
      };
    },
    updateCurrentUser(state, { payload }) {
      const { currentUser } = state;
      return {
        ...state,
        currentUser:{...currentUser,...payload.data},
        status: payload.status,
      }
    },
    updateCurrentUserNoStatus(state,{ payload }){
      const { currentUser } = state;
      return {
        ...state,
        currentUser:{...currentUser,...payload.data,status:currentUser.status},
        status: payload.status,
      }
    },
  },
};
