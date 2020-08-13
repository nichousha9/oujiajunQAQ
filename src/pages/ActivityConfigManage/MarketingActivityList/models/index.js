import { message } from 'antd';
import { qryRegions, qryZqythRoles, qryZqythUser } from '@/services/approve';
import { qryHandoverUserList } from '@/services/marketingActivityList';

export default {
  namespace: 'MarketingActivityListApproveDetail',
  state: {},
  effects: {
    *qryRegions({ payload, success }, { call }) {
      const res = yield call(qryRegions, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询区域失败');
      }
    },
    *qryZqythRoles({ payload, success }, { call }) {
      const res = yield call(qryZqythRoles, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询角色失败');
      }
    },
    *qryZqythUser({ payload, success }, { call }) {
      const res = yield call(qryZqythUser, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询账号失败');
      }
    },
    *qryHandoverUserList({ payload, success }, { call }) {
      const res = yield call(qryHandoverUserList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询角色失败');
      }
    },
  },
  reducers: {},
  subscriptions: {},
};
