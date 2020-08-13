import { message } from 'antd';

import { getMccFolderList, getCampaignList } from '@/services/common';

const models = {
  name: 'campaignModal',
  state: {},
  effects: {
    *getMccFolderListEffect({ payload }, { call }) {
      let result;

      try {
        result = yield call(getMccFolderList, payload);
      } catch (err) {
        message.error('请求失败');
      }

      return result;
    },

    *getCampaignListEffect({ payload }, { call, select }) {
      let result;
      const userId = yield select(state => state.user.userInfo.staffInfo.staffId);
      try {
        result = yield call(getCampaignList, { ...payload, userId });
      } catch (err) {
        message.error('请求失败');
      }

      return result;
    },
  },
  reducers: {},
};

export default models;
