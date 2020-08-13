/* eslint-disable no-unused-vars */
import { message } from 'antd';
import {
  getMccFolderList,
  addMccFolder,
  updateMccFolder,
  delMccFolder,
  getCampaignList,
  delCampaign,
  terminateCampaign,
  suspendCampaign,
  resumeCampaign,
  changeCampaignStateToEditing,
  qryApprovalProcessedList,
  qryAttrValueByCode,
  toPubCamp,
  publishCampaignWithoutApproval,
  judgeCampaignFromSms,
  handoverCampaign,
  getCampaignparticulars,
  copyCampaignInfo,
  shutdownJobByCamId,
  updContactArchiveByCamId,
} from '@/services/marketingActivityList';

import { qryCamTempList } from '@/services/activityConfigModel';

export default {
  namespace: 'marketingActivityList',
  state: {
    data: [],
    pageInfo: {},
  },
  effects: {
    *getMccFolderList({ payload, callback }, { call }) {
      const response = yield call(getMccFolderList, payload);
      if (callback && typeof callback === 'function') callback(response || []);
      return response;
    },
    *shutdownJobByCamId({ payload, callback }, { call }) {
      const response = yield call(shutdownJobByCamId, payload);
      if (callback && typeof callback === 'function') callback(response || []);
      return response;
    },
    *copyCampaignInfo({ payload }, { call }) {
      const response = yield call(copyCampaignInfo, payload);
      return response;
    },
    *updContactArchiveByCamId({ payload, callback }, { call }) {
      const response = yield call(updContactArchiveByCamId, payload);
      if (callback && typeof callback === 'function') callback(response || []);
      return response;
    },
    *addMccFolder({ payload }, { call }) {
      const response = yield call(addMccFolder, payload);
      return response;
    },
    *updateMccFolder({ payload }, { call }) {
      const response = yield call(updateMccFolder, payload);
      return response;
    },
    *delMccFolder({ payload }, { call }) {
      const response = yield call(delMccFolder, payload);
      return response;
    },
    *getCampaignList({ payload }, { call, select }) {
      // const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      return yield call(getCampaignList, { ...payload });
    },
    *delCampaign({ payload }, { call }) {
      const response = yield call(delCampaign, payload);
      return response;
    },
    *terminateCampaign({ payload }, { call }) {
      const response = yield call(terminateCampaign, payload);
      return response;
    },
    *suspendCampaign({ payload }, { call }) {
      const response = yield call(suspendCampaign, payload);
      return response;
    },
    *resumeCampaign({ payload }, { call }) {
      const response = yield call(resumeCampaign, payload);
      return response;
    },
    *changeCampaignStateToEditing({ payload }, { call }) {
      const response = yield call(changeCampaignStateToEditing, payload);
      return response;
    },
    *qryApprovalProcessedList({ payload }, { call }) {
      const response = yield call(qryApprovalProcessedList, payload);
      return response;
    },
    *qryAttrValueByCode({ payload }, { call }) {
      const response = yield call(qryAttrValueByCode, payload);
      return response;
    },
    *toPubCamp({ payload }, { call }) {
      const response = yield call(toPubCamp, payload);
      return response;
    },
    *publishCampaignWithoutApproval({ payload }, { call }) {
      const response = yield call(publishCampaignWithoutApproval, payload);
      return response;
    },
    *judgeCampaignFromSms({ payload }, { call }) {
      const response = yield call(judgeCampaignFromSms, payload);
      return response;
    },
    *handoverCampaign({ payload, success }, { call }) {
      const res = yield call(handoverCampaign, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        // const { svcCont } = res;
        if (typeof success === 'function') {
          success(res);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询角色失败');
      }
    },

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
  },
  reducers: {},
  subscriptions: {},
};
