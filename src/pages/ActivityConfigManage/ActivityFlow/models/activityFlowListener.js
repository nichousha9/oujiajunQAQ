import { message } from 'antd';
import {
  qryEventInputs,
  qryEvtEventInfos,
  addProcess,
  modProcess,
  qryMccListener
} from '@/services/ActivityConfigManage/activityFlowListener';

export default {
  namespace: 'activityFlowListener',
  state: {
  },
  effects: {
    *qryEventInputs({ payload, success }, { call }) {
      const res = yield call(qryEventInputs, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryEvtEventInfos({ payload, success }, { call }) {
      const res = yield call(qryEvtEventInfos, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *addProcess({ payload, success }, { call }) {
      const res = yield call(addProcess, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *modProcess({ payload, success }, { call }) {
      const res = yield call(modProcess, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryMccListener({ payload, success }, { call }) {
      const res = yield call(qryMccListener, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
