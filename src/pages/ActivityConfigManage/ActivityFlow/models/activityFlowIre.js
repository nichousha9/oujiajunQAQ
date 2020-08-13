import { message } from 'antd';
import {
  qryAlgoFoldList,
  qryAlgoModuleList,
  qryMccIdeInterveneConf,
  qryMccInterveneRule,
  addProcess,
  modProcess,
  qryMccAppAllInfo
} from '@/services/ActivityConfigManage/activityFlowIre';

export default {
  namespace: 'activityFlowIre',
  state: {
  },
  effects: {
    *qryAlgoFoldList({ payload, success }, { call }) {
      const res = yield call(qryAlgoFoldList, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryAlgoModuleList({ payload, success }, { call }) {
      const res = yield call(qryAlgoModuleList, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryMccIdeInterveneConf({ payload, success }, { call }) {
      const res = yield call(qryMccIdeInterveneConf, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryMccInterveneRule({ payload, success }, { call }) {
      const res = yield call(qryMccInterveneRule, payload);
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
    *qryMccAppAllInfo({ payload, success }, { call }) {
      const res = yield call(qryMccAppAllInfo, payload);
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
