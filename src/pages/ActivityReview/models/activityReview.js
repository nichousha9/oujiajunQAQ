import { message } from 'antd';
import {
  qryApprovalRecordList,
  insertApprovalRecord,
  qryApprovalRecordListByCampaign,
  qryFlowchartByRecordId,
  qryProcessTimingByCampaignId,
} from '@/services/activityReview/activityReview';

const models = {
  namespace: 'activityReview',
  state: {
    // 审批状态
    approveStatus: {
      '1000': '未审批',
      '2000': '审批通过',
      '3000': '审批不通过',
    },
    formData: {}, // 表单数据
    // 列表页分页信息
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  effects: {
    *qryApprovalRecordList({ payload, success }, { call, select }) {
      const pageInfo = yield select(state => state.activityReview.pageInfo);
      const res = yield call(qryApprovalRecordList, { pageInfo, ...payload });
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else {
        message.error((res.topCont && res.topCont.remark) || '请求失败');
      }
    },
    *insertApprovalRecord({ payload, success }, { call }) {
      const res = yield call(insertApprovalRecord, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
        message.success('成功');
      } else {
        message.error((res.topCont && res.topCont.remark) || '请求失败');
      }
    },
    *qryApprovalRecordListByCampaign({ payload, success }, { call }) {
      const res = yield call(qryApprovalRecordListByCampaign, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else {
        message.error((res.topCont && res.topCont.remark) || '请求失败');
      }
    },
    *qryFlowchartByRecordId({ payload, success }, { call }) {
      const res = yield call(qryFlowchartByRecordId, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else {
        message.error((res.topCont && res.topCont.remark) || '请求失败');
      }
    },
    *qryProcessTimingByCampaignId({ payload, success }, { call }) {
      const res = yield call(qryProcessTimingByCampaignId, payload);
      if (res && res.topCont && res.topCont.resultCode === '0') {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else {
        message.error((res.topCont && res.topCont.remark) || '请求失败');
      }
    },
  },
  reducers: {
    // 设置数据
    setData(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
};

export default models;
