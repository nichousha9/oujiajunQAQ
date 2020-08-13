import {
  qryAllProcessTypes,
  getCampaignList,
  addFlowChart,
  modFlowChart,
  qryFlowChartInfoById,
  qryFlowChartByCampaignId,
  saveCampaign,
  updateFlowChartContent,
  qryFlowChartContentById,
  getFlowChartProcessState,
  qryProcessState,
  delProcess,
  checkInCampCyclePeriod,
  checkListenerSegApplyInst,
  qryProcessOptimize,
  runProcess,
  addMccProcess,
  getSeqWithProcess,
  getSmartTableCode,
  checkProcessCanOptimize,
  qryMccListener,
  checkIsAllAudience,
  qryMccTestContactSeg,
  qryBatchByProcessId,
  testProcess,
  checkFlowchartBeforeRun,
  runFlowChart,
  queryCampignKpi,
  lockFlowChart,
  unLockFlowChart,
  optimizeProcess,
  qryAllLan,
  updateCampaignBasic,
} from '@/services/ActivityConfigManage/ActivityFlow';
import { getMccFolderList, getCampaignparticulars } from '@/services/marketingActivityList';

import { message } from 'antd';

const ActivityFlow = {
  namespace: 'activityFlow',
  state: {
    processTypes: [], // 所有的进程类型
  },
  effects: {
    *unLockFlowChart({ payload }, { call }) {
      return yield call(unLockFlowChart, payload);
    },
    *lockFlowChart({ payload }, { call }) {
      return yield call(lockFlowChart, payload);
    },
    *getCampaignparticulars({ payload, callback }, { call }) {
      const response = yield call(getCampaignparticulars, payload);
      if (callback && typeof callback === 'function') callback(response || []);
      return response;
    },
    *queryCampignKpi({ payload }, { call }) {
      return yield call(queryCampignKpi, payload);
    },
    *runFlowChart({ payload }, { call }) {
      return yield call(runFlowChart, payload);
    },
    *checkFlowchartBeforeRun({ payload }, { call }) {
      return yield call(checkFlowchartBeforeRun, payload);
    },
    *testProcess({ payload }, { call }) {
      return yield call(testProcess, payload);
    },
    *qryBatchByProcessId({ payload }, { call }) {
      return yield call(qryBatchByProcessId, payload);
    },
    *qryMccTestContactSeg({ payload }, { call }) {
      return yield call(qryMccTestContactSeg, payload);
    },
    *checkIsAllAudience({ payload }, { call }) {
      return yield call(checkIsAllAudience, payload);
    },
    *qryMccListener({ payload }, { call }) {
      return yield call(qryMccListener, payload);
    },
    *checkProcessCanOptimize({ payload }, { call }) {
      return yield call(checkProcessCanOptimize, payload);
    },
    *getSmartTableCode({ payload }, { call }) {
      return yield call(getSmartTableCode, payload);
    },
    *getSeqWithProcess({ payload }, { call }) {
      return yield call(getSeqWithProcess, payload);
    },
    *runProcess({ payload }, { call }) {
      return yield call(runProcess, payload);
    },
    *qryProcessOptimize({ payload }, { call }) {
      return yield call(qryProcessOptimize, payload);
    },
    *checkListenerSegApplyInst({ payload }, { call }) {
      return yield call(checkListenerSegApplyInst, payload);
    },
    *checkInCampCyclePeriod({ payload }, { call }) {
      return yield call(checkInCampCyclePeriod, payload);
    },
    *delProcess({ payload }, { call }) {
      return yield call(delProcess, payload);
    },
    *qryProcessState({ payload }, { call }) {
      return yield call(qryProcessState, payload);
    },
    *getFlowChartProcessState({ payload }, { call }) {
      return yield call(getFlowChartProcessState, payload);
    },
    *qryFlowChartContentById({ payload }, { call }) {
      return yield call(qryFlowChartContentById, payload);
    },
    *updateFlowChartContent({ payload }, { call }) {
      return yield call(updateFlowChartContent, payload);
    },
    *saveCampaign({ payload }, { call }) {
      return yield call(saveCampaign, payload);
    },
    *updateCampaignBasic({ payload }, { call }) {
      return yield call(updateCampaignBasic, payload);
    },
    *qryAllProcessTypes({ payload }, { call }) {
      return yield call(qryAllProcessTypes, payload);
    },
    *qryFlowChartByCampaignId({ payload }, { call }) {
      return yield call(qryFlowChartByCampaignId, payload);
    },
    *qryFlowChartInfoById({ payload }, { call }) {
      return yield call(qryFlowChartInfoById, payload);
    },
    *modFlowChart({ payload }, { call }) {
      return yield call(modFlowChart, payload);
    },
    *addFlowChart({ payload }, { call }) {
      return yield call(addFlowChart, payload);
    },
    *getCampaignList({ payload }, { call }) {
      // const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      return yield call(getCampaignList, { ...payload });
    },
    *getMccFolderList({ payload }, { call }) {
      return yield call(getMccFolderList, payload);
    },
    *optimizeProcess({ payload }, { call }) {
      return yield call(optimizeProcess, payload);
    },

    *addMccProcess({ payload }, { call }) {
      return yield call(addMccProcess, payload);
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
  reducers: {},
};
export default ActivityFlow;
