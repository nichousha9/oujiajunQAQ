import { message } from 'antd';
import {
  qryCamType,
  getCampaignList,
  qryStateNum,
  qryCamCompartion,
  qryCamBusiTypeTree,
  qryMccJobPlanList,
  qryMccJobPlanDetail,
} from '@/services/evaluationAnalysis';

const Model = {
  namespace: 'EvaluationAnalysis',
  state: {},
  effects: {
    *qryCamSelectType({ payload, success }, { call }) {
      const res = yield call(qryCamType, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryCamBusiTypeTree({ payload, success }, { call }) {
      const res = yield call(qryCamBusiTypeTree, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *qryCampaignList({ payload, success }, { call, select }) {
      const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      const res = yield call(getCampaignList, { ...payload, userId });
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *qryMccJobPlanList({ payload, success }, { call, select }) {
      const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      const res = yield call(qryMccJobPlanList, { ...payload, userId });
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *qryMccJobPlanDetail({ payload, success }, { call, select }) {
      const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      const res = yield call(qryMccJobPlanDetail, { ...payload, userId });
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *getStateNum({ payload, success }, { call, select }) {
      const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      const res = yield call(qryStateNum, { ...payload, userId });
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *getCamCompartion({ payload, success }, { call }) {
      const res = yield call(qryCamCompartion, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
  },
  reducers: {},
};
export default Model;
