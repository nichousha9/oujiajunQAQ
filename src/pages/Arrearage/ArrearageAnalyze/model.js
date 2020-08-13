import { message } from 'antd';
import {
  qryCityOweRank,
  qryOweTrend,
  qryLargeOwePer,
  qryProdTypeCompose,
  qryProdChannelCompose,
  qryOweReasonCompose,
  qryDetailsList,
  qryMap,
} from '@/services/arrearage/arrearageAnalyze';

const initState = {
  monthId: '', // 账期
};
const Model = {
  namespace: 'arrearageAnalyze',
  state: initState,
  effects: {
    *qryCityOweRank({ payload, success }, { call }) {
      const res = yield call(qryCityOweRank, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryOweTrend({ payload, success }, { call }) {
      const res = yield call(qryOweTrend, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryLargeOwePer({ payload, success }, { call }) {
      const res = yield call(qryLargeOwePer, payload);
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
    *qryMap({ payload, success }, { call }) {
      const res = yield call(qryMap, payload);
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
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    // 更改月份（账期）
    setMonthId(state, { payload }) {
      return Object.assign({}, state, payload);
    },

    clear() {
      return initState;
    },
  },
};
export default Model;
