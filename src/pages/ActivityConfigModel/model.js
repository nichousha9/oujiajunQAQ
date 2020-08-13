import { message } from 'antd';
import {
  qryCamTempList,
  updateCampaignState,
  qryCamBusiTypeTree,
} from '@/services/activityConfigModel';

const Model = {
  namespace: 'activityConfigModel',
  state: {
    data: [], // 列表
    pageNum: 1,
    pageSize: 10,
    pageInfo: {}, // 后端的返回
    formValue: {},
    historyState: '',
  },
  effects: {
    *qryCamTempList({ payload, success }, { call }) {
      const res = yield call(qryCamTempList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *updateCampaignState({ payload, callback }, { call }) {
      const response = yield call(updateCampaignState, payload);
      if (callback && typeof callback === 'function') callback(response || []);
      return response;
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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
