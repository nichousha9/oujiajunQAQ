import { message } from 'antd';
import {
  getMccFolderList,
  addMccFolder,
  updateMccFolder,
  delMccFolder,
} from '@/services/marketingActivityList';

import {
  qryApprovalFlowchart,
  delApprovalFlowchart,
  copyApprovalFlowchart,
  updApprovalFlowchartState,
} from '@/services/approve';

export default {
  namespace: 'approveList',
  state: {
    formValue: {},
    list: [],
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    copyApproveInfo: {}, // 当前要复制的审批模板信息
    pageType: '', // 页面类型，判断是否从详情页回去保留前一步搜索内容
  },
  effects: {
    *getMccFolderList({ payload, success }, { call }) {
      const res = yield call(getMccFolderList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '获取目录列表失败');
      }
    },
    *addMccFolder({ payload, success }, { call }) {
      const res = yield call(addMccFolder, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '添加目录失败');
      }
    },
    *updateMccFolder({ payload, success }, { call }) {
      const res = yield call(updateMccFolder, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '添加目录失败');
      }
    },
    *delMccFolder({ payload, success }, { call }) {
      const res = yield call(delMccFolder, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '添加目录失败');
      }
    },
    *qryApprovalFlowchart({ payload, success }, { call, select }) {
      const { pageInfo } = yield select(state => state.approveList);
      const res = yield call(qryApprovalFlowchart, { pageInfo, ...payload });
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '获取列表数据失败');
      }
    },
    *delApprovalFlowchart({ payload, success }, { call }) {
      const res = yield call(delApprovalFlowchart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '删除失败');
      }
    },
    *copyApprovalFlowchart({ payload, success }, { call }) {
      const res = yield call(copyApprovalFlowchart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '复制失败');
      }
    },
    *updApprovalFlowchartState({ payload }, { call }) {
      return yield call(updApprovalFlowchartState, payload);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {},
};
