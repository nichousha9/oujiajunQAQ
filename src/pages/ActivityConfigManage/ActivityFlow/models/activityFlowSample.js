import { message } from 'antd';
import {
  qryProcess,
  addProcess,
  modProcess,
  getDimList,
  qryTarGrps
} from '@/services/ActivityConfigManage/ActivitySelect';

export default {
  namespace: 'activityFlowSample',
  state: {
  },
  effects: {
    *addProcess({ payload, success }, { call }) {
      const res = yield call(addProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
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
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryProcess({ payload, success }, { call }) {
      const res = yield call(qryProcess, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *getDimList({ payload, success }, { call }) {
      const res = yield call(getDimList, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryTarGrps({ payload, success }, { call }) {
      const res = yield call(qryTarGrps, payload);
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
