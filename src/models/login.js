/* eslint-disable no-console */
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { accountLogin, accountLogout, loginbyPhone } from '../services/api';
import { selectStaffMenus } from '../services/user';
import { setAuthority } from '../utils/authority';
import { setUserInfo, setUserMenu, setCurrentOwer } from '../utils/userInfo';
import { reloadAuthorized } from '../utils/Authorized';
import { filterMenu, getOnlineMenu, logoutUrl } from '../utils/utils';
// import { menuData } from '../common/menu';

export default {
  namespace: 'login',

  state: {
    noAuth: false, // 用户是否有菜单权限
    status: undefined,
    msgStatus: undefined,
    menuData: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      let loginType = accountLogin;
      if (payload.type === 'mobile') {
        loginType = loginbyPhone;
      }
      const response = yield call(loginType, payload);
      response.from = payload.from;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully 以后再多租户的时候刷新，登录成功会再多次执行
      if (response && response.status === 'OK') {
        yield put({ type: 'loginSuccess', payload: { response, lastPayload: payload } });
      }
    },
    *selectStaffMenus({ payload }, { call, put }) {
      const response = yield call(selectStaffMenus, payload);
      yield put({
        type: 'saveMenus',
        payload: response.data,
      });
      return response;
    },
    *loginSuccess({ payload }, { call, put, select }) {
      let menuData = yield select((state) => {
        return state.login.menuData;
      });
      // const noAuth = yield select(state =>{
      //   return state.login.noAuth
      // })
      // 解决第一次的账号无权限必须刷新了才能用有权限的账号登录的bug   会导致登录时跳转系统管理
      // if (menuData && !menuData.length && noAuth) {
      const res = yield call(selectStaffMenus, payload);
      if (res.data) {
        yield put({
          type: 'saveMenus',
          payload: res.data,
        });
        menuData = getOnlineMenu(res.data);
      }
      // }
      const { response = {}, lastPayload = {} } = payload;
      // 存租户信
      yield put({
        type: 'global/saveOwnerInfo',
        payload: response.data.userInfo,
      });
      setCurrentOwer({});
      reloadAuthorized();
      // 登录成功之后
      // 1.判断是否有orgid，若没有，进入企业创建页面
      if (!response.data.userInfo.orgid || response.data.userInfo.orgid === '') {
        yield put(routerRedux.push('/user/register/org'));
        return;
      }
      // 2.判断是否为多租户，是则进入多租户页面
      // if(response.data.sysConfig &&
      //   response.data.sysConfig.enabletneant && response.data.sysConfig.tenantconsole
      //   && !response.data.userInfo.superuser){
      //   yield put(routerRedux.push('/header/createtenant'));
      //   return;
      // }
      // 3.进入首页控制台
      if (!lastPayload.from || lastPayload.from !== 'register') {
        // 根据当前用户的权限跳转到第一个路径;
        // 当前用户的权限
        const {
          userInfo: { roleAuthMap },
        } = response.data;
        const newMenuArr = filterMenu(menuData, 'authId', roleAuthMap);
        //  console.log('newMenuArr', newMenuArr);
        yield put({
          type: 'setUserAuth',
          payload: newMenuArr.length <= 0,
        });
        yield put({
          type: 'saveOwnMenus',
          payload: newMenuArr,
        });
        setUserMenu(newMenuArr);
        if (newMenuArr.length > 0) {
          // yield put(routerRedux.push(`${newMenuArr[0].path}`));
          const routerPushUrl = newMenuArr.filter(
            (item) => item.path === '/operationView/operationView'
          );
          if (routerPushUrl.length) {
            yield put(routerRedux.push(`${routerPushUrl[0].path}`));
          } else {
            yield put(routerRedux.push(`${newMenuArr[0].path}`));
          }
        } else {
          message.error('请联系管理员配置权限');
          yield put(routerRedux.push('/user/login'));
          // yield put(routerRedux.push(`/knowledgeSupplement/knowledgeSupplement`));
        }
      }
    },
    *logout(_, { call, put }) {
      yield call(accountLogout);
      // 清除用户信息
      // 清除缓存
      setUserInfo({});
      setCurrentOwer({});
      localStorage.clear(); // 清除当前的缓存;

      if (logoutUrl !== '') {
        // console.log('logoutUrl',logoutUrl)
        window.location = logoutUrl;
      } else {
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    setUserAuth(state, { payload }) {
      return {
        ...state,
        noAuth: payload,
      };
    },
    // 登录登出状态改变
    changeLoginStatus(state, { payload }) {
      // Login successfully
      if (payload.status === 'OK') {
        setAuthority('admin');
        setUserInfo(payload.data.userInfo);
      }

      return {
        ...state,
        status: payload.status === 'OK' ? 'OK' : payload.status,
        msgStatus: payload.msg,
      };
    },
    saveMenus(state, { payload }) {
      const menus = getOnlineMenu(payload);
      return {
        ...state,
        menuData: menus,
      };
    },
    saveOwnMenus(state, { payload }) {
      return {
        ...state,
        menuData: payload,
      };
    },
  },
};
