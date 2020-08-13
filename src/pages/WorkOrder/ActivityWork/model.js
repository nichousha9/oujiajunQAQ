import { message } from 'antd';
import {
  getCampaignList,
  qryStateNum,
  qryAllLan,
} from '@/services/ActivityConfigManage/ActivityFlow';

const Model = {
  namespace: 'activityWork',
  state: {
    data: [], // 列表
    pageNum: 1,
    pageSize: 10,
    pageInfo: {}, // 后端的返回
    historyState: '',
  },
  effects: {
    *getCampaignList({ payload, success }, { call, select }) {
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
    *qryStateNum({ payload, success }, { call, select }) {
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

    *qryAllLan({ payload, success }, { call }) {
      const res = yield call(qryAllLan, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询区域失败');
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
