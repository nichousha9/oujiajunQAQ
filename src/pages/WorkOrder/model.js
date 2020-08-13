import { message } from 'antd';
import {
  qryContactList,
  qryContactDetail,
  qryCamBusiTypeTree,
  qryCampaignPage,
} from '@/services/workOrder';
// import { qryCamType, qryAllLan } from '@/services/ActivityConfigManage/ActivityFlow';

const Model = {
  namespace: 'workOrder',
  state: {
    data: [], // 列表
    pageNum: 1,
    pageSize: 10,
    pageInfo: {}, // 后端的返回
    formValue: {},
    historyState: '',
  },
  effects: {
    *qryContactList({ payload, success }, { call }) {
      const res = yield call(qryContactList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    *qryCampaignPage({ payload, success }, { call }) {
      const res = yield call(qryCampaignPage, payload);
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
    *qryContactDetail({ payload, success }, { call }) {
      const res = yield call(qryContactDetail, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },

    // *qryAllLan({ payload, success }, { call }) {
    //   const res = yield call(qryAllLan, payload);
    //   if (res && res.topCont && res.topCont.resultCode == 0) {
    //     const { svcCont } = res;
    //     if (typeof success === 'function') {
    //       success(svcCont);
    //     }
    //   } else if (res) {
    //     message.error((res.topCont && res.topCont.remark) || '查询区域失败');
    //   }
    // },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
