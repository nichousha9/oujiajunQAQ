import { message } from 'antd';
import { qryDetailsList, qryOrganizationLevel2 } from '@/services/arrearage/arrearageDetails';
import {
  qryOweReasonCompose,
  qryProdChannelCompose,
  qryProdTypeCompose,
} from '@/services/arrearage/arrearageAnalyze';

const models = {
  namespace: 'arrearageDetails',
  state: {},

  effects: {
    *qryDetailsList({ payload, success }, { call }) {
      const res = yield call(qryDetailsList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *qryOrganizationLevel2({ payload, success }, { call }) {
      const res = yield call(qryOrganizationLevel2, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryProdTypeCompose({ payload, success }, { call }) {
      const res = yield call(qryProdTypeCompose, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryProdChannelCompose({ payload, success }, { call }) {
      const res = yield call(qryProdChannelCompose, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryOweReasonCompose({ payload, success }, { call }) {
      const res = yield call(qryOweReasonCompose, payload);
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

export default models;
