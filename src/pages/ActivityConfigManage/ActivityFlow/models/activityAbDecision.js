import { message } from 'antd';
import {
  addProcess,
  modProcess,
  qryProcessCellName,
  getAbDetatil,
  getSeqList,
} from '@/services/ActivityConfigManage/activityAbDecision';
import {
  qryProcessCellInfo
} from '@/services/ActivityConfigManage/activityFlowContact';

export default {
  namespace: 'activityAbDecision',
  state: {
    sampleList: [], // 采样列表
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
    *qryProcessCellName({ payload, success }, { call }) {
      const res = yield call(qryProcessCellName, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryProcessCellInfo({ payload, success }, { call }) {
      const res = yield call(qryProcessCellInfo, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *getAbDetatil({ payload, success }, { call }) {
      const res = yield call(getAbDetatil, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *getSeqList({ payload, success }, { call }) {
      const res = yield call(getSeqList, payload);
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
    reset(state) {
      return {
        ...state,
        sampleList: [], // 采样列表
      };
    },
  },
};
