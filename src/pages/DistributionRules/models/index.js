import { message } from 'antd';
import {
  selectDispatchRules,
  qryDispatchRules,
  addDispatchRules,
  modDispatchRules,
  delDispatchRules,
} from '@/services/distribution';
import { qryAttrValueByCode } from '@/services/common';

// 判断接口响应
function judgeResponse(response, success, fail) {
  try {
    if (response && response.topCont && parseInt(response.topCont.resultCode, 10) === 0) {
      if (typeof success === 'function') {
        success(response.svcCont);
      }
      return response.svcCont;
    }
    message.error((response && response.topCont && response.topCont.remark) || '操作失败');
    if (typeof fail === 'function') {
      fail();
    }
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export default {
  namespace: 'distributionRules',
  state: {
    ORDER_CREATE_TYPE: {}, // 派发规则静态字段
  },
  effects: {
    *selectDispatchRules({ payload, success }, { call }) {
      const res = yield call(selectDispatchRules, payload);
      judgeResponse(res, success);
    },
    *qryDispatchRules({ payload, success }, { call }) {
      const res = yield call(qryDispatchRules, payload);
      judgeResponse(res, success);
    },
    *addDispatchRules({ payload, success }, { call }) {
      const res = yield call(addDispatchRules, payload);
      judgeResponse(res, success);
    },
    *modDispatchRules({ payload, success }, { call }) {
      const res = yield call(modDispatchRules, payload);
      judgeResponse(res, success);
    },
    *delDispatchRules({ payload, success }, { call }) {
      const res = yield call(delDispatchRules, payload);
      judgeResponse(res, success);
    },
    *qryAttrValueByCode({ payload }, { call, put }) {
      const res = yield call(qryAttrValueByCode, payload);
      const svcCont = judgeResponse(res);
      const { data } = svcCont;
      const obj = {};
      if (data.length) {
        data.forEach(value => {
          obj[value.attrValueCode] = value.attrValueName;
        });
        yield put({
          type: 'save',
          payload: {
            ORDER_CREATE_TYPE: obj,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
};
