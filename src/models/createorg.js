import { routerRedux } from 'dva/router';
import { orgCreater, getOrgStaticCode } from '../services/api';
import { getUserInfo } from "../utils/userInfo";

export default {
  namespace: 'createorg',

  state: {
    status:undefined,
    scaleCode: [],
    typeCode:[],
  },

  effects: {
      *doCreate({ payload }, { call, put }) {
        const response = yield call(orgCreater, payload);
        if(response.status === 'OK'){
            // 判断是否为多租户，是则进入多租户页面
            if(getUserInfo.sysConfig && getUserInfo.sysConfig.enabletneant && getUserInfo.sysConfig.tenantconsole && !getUserInfo.userInfo.superuser){
                     yield put(routerRedux.push('/header/createtenant'));
            } else {
              yield put(routerRedux.push('/'));
            }
        }else{
            yield put({
              type: 'orgCreate',
              payload: response,
            });
        }
      },
      *getTypeCode({ payload }, { call, put }) {
        payload.pcode = 'com.dic.organization.type';
        const response = yield call(getOrgStaticCode, payload);

        yield put({
          type: 'getType',
          payload: response,
        });
      },
      *getScaleCode({ payload }, { call, put }) {
        payload.pcode = 'com.dic.organization.scale';
        const response = yield call(getOrgStaticCode, payload);

        yield put({
          type: 'getScale',
          payload: response,
        });
      },
  },

  reducers: {
    // 创建企业
  orgCreate(state, { payload }) {
    return {
      ...state,
      status: payload.status,
    };
  },
  // 获取静态数据
  getType(state, { payload }) {
      return {
        ...state,
        scaleCode: payload.data,
      };
    },
    getScale(state, { payload }) {
        return {
          ...state,
          typeCode: payload.data,
        };
      },
  },
};
