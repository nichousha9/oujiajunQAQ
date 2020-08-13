import { message } from 'antd';
import {
  qryCamSchedulerNode,
  addProcess,
  modProcess,
  qryTimingByObjectId,
  qryTiming,
  qryTimeListByTimingId,
  qryRunTimeLog,
  updateCamSchedulerNode,
} from '@/services/ActivityConfigManage/activityFlowSchedule';

import { getCampaignparticulars } from '@/services/marketingActivityList';

export default {
  namespace: 'activityFlowSchedule',
  state: {},
  effects: {
    *qryCamSchedulerNode({ payload, success }, { call }) {
      const res = yield call(qryCamSchedulerNode, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *updateCamSchedulerNode({ payload, success }, { call }) {
      const res = yield call(updateCamSchedulerNode, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *getCampaignparticulars({ payload, success }, { call }) {
      const res = yield call(getCampaignparticulars, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *addProcess({ payload, success }, { call }) {
      const response = yield call(addProcess, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *modProcess({ payload, success }, { call }) {
      const response = yield call(modProcess, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryTimingByObjectId({ payload, success }, { call }) {
      const response = yield call(qryTimingByObjectId, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryTiming({ payload, success }, { call }) {
      const response = yield call(qryTiming, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryTimeListByTimingId({ payload, success }, { call }) {
      const response = yield call(qryTimeListByTimingId, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryRunTimeLog({ payload, success }, { call }) {
      const response = yield call(qryRunTimeLog, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
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
