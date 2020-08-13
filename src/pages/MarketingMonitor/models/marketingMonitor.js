import { message } from 'antd';

import { qryAttrValueByCode } from '@/services/common';

import {
  queryBatchDetailInfo,
  qryProcessTypeByContact,
  qryBatchCellDetailInfo,
  qryMccContactInfo,
  qryMessageInfo,
  qryCreativeAndOffer,
  qrySubExtendList,
  qryMemberTableInfoByTest,
  qryMemberTableInfo,
  qryAdviceChannel,
} from '@/services/MarketingMonitor/marketingMonitor';

function getNumGroup(batch) {
  const totalNum = batch.TOTAL_NUM || 0;
  const succeedNum = batch.SUCCEED_NUM || 0;
  const failNum = batch.FAILED_NUM || 0;
  const pendingNum = totalNum - succeedNum - failNum;
  const numGroup = {
    TOTAL_NUM: totalNum,
    SUCCEED_NUM: succeedNum,
    FAILED_NUM: failNum,
    PENDING_NUM: pendingNum < 0 ? 0 : pendingNum,
  };
  return numGroup;
}

// function formatBatchList(batchList) {
//   const res = [];
//   batchList.forEach(batch => {
//     const numGroup = getNumGroup(batch);
//     let params = { ...batch, ...numGroup };
//     if (!batch.children) {
//       params = { ...params, children: [] };
//     }
//     res.push({
//       ...params,
//     });
//   });
//   return res;
// }

function formatChildren(children) {
  const tempChildren = [...children];
  return tempChildren.map(child => {
    let tempChild = { ...child };
    const CONCAT_CHANNEL = tempChild.PROCESS_TYPE;
    // 标记为children
    const flag = 1;
    const numGroup = getNumGroup(child);
    tempChild = { ...tempChild, CONCAT_CHANNEL, flag, ...numGroup };
    return tempChild;
  });
}

function addChildrenToBatch(children, batchList, batchID) {
  const tempBatchList = [...batchList];
  return tempBatchList.map(batch => {
    let tempBatch = { ...batch };
    if (tempBatch.ID === batchID) {
      const tempChildren = [...children];
      const resChildren = tempChildren.map(child => {
        let tempChild = { ...child };
        const { ADVICE_CHANNEL_NAME, START_DATE, END_DATE, CAMPAIGN_NAME } = tempBatch;
        const other = {
          ADVICE_CHANNEL_NAME,
          START_DATE,
          END_DATE,
          CAMPAIGN_NAME,
        };
        tempChild = { ...tempChild, ...other };
        return tempChild;
      });
      tempBatch = { ...batch, children: [...resChildren] };
    }
    return tempBatch;
  });
}

const models = {
  name: 'marketingMonitor',
  state: {
    campaignVisible: false,
    campaignNames: '',
    campaignCodes: '',
    campaignIds: [],
    batchList: [],
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    staticVisible: false,
    selectedBatch: {},
    // campaignInfoModal
    campaignInfoVisible: false,
    campaignInfoList: [],
    campaignInfoPageInfo: {
      pageNum: 1,
      pageSize: 5,
      total: 0,
    },
    messageInfo: {},
    subExtendList: [],
    subExtendPageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    // memberInfo
    memberInfoVisible: false,
    memberInfoList: [],
    memberInfoPageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  },
  effects: {
    *getProcessListEffect(_, { call }) {
      let result;
      try {
        result = yield call(qryProcessTypeByContact, {});
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getStatusListEffect({ payload }, { call }) {
      let result;
      try {
        result = yield call(qryAttrValueByCode, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getBatchListEffect({ payload }, { call, put, select }) {
      try {
        const defaultParams = {
          BATCH_NAME: '',
          BATCH_STATE: '',
          CAMPAIGN_CODE: '',
          END_DATE: '',
          IS_TEST: '',
          PROCESS_TYPE: '',
          START_DATE: '',
          IS_BATCH: 'Y',
        };
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.marketingMonitor.pageInfo,
        );
        const CAMPAIGN_CODE = yield select(state => state.marketingMonitor.campaignCodes);
        const params = { ...defaultParams, ...payload, pageNum, pageSize, CAMPAIGN_CODE };
        const result = yield call(queryBatchDetailInfo, params);

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            // const formatedBatchList = formatBatchList(result.svcCont.data);
            const formatedBatchList = result.svcCont.data;
            yield put({
              type: 'getBatchList',
              payload: formatedBatchList,
            });

            yield put({
              type: 'getPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getBatchCellDetailInfoEffect({ payload }, { call, put, select }) {
      try {
        const { BATCH_ID } = payload;
        const result = yield call(qryBatchCellDetailInfo, payload);
        const currentBatchList = yield select(state => state.marketingMonitor.batchList);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            const children = formatChildren(result.svcCont.data);
            const formatedBatchList = addChildrenToBatch(children, currentBatchList, BATCH_ID);

            yield put({
              type: 'getBatchList',
              payload: formatedBatchList,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getContactInfoListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.marketingMonitor.campaignInfoPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const params = { pageInfo, ...payload };
        const result = yield call(qryMccContactInfo, params);

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getCampaignInfoList',
              payload: result.svcCont.data,
            });

            yield put({
              type: 'getCampaignInfoPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getMessageInfoEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryMessageInfo, payload);

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getMessageInfo',
              payload: result.svcCont.data,
            });
          }

          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getOffersAndCreativeEffect({ payload }, { call }) {
      let result;
      try {
        result = yield call(qryCreativeAndOffer, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getSubExtendListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.marketingMonitor.subExtendPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const params = { pageInfo, ...payload };
        const result = yield call(qrySubExtendList, params);

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getSubExtendList',
              payload: result.svcCont.data,
            });

            yield put({
              type: 'getSubExtendPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getMemberInfoListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.marketingMonitor.memberInfoPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const { isTest, ...others } = payload;
        const contactNumber = '';
        const params = { pageInfo, ...others, contactNumber };

        let result;
        if (isTest === 'Y') {
          result = yield call(qryMemberTableInfoByTest, params);
        } else {
          result = yield call(qryMemberTableInfo, params);
        }

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getMemberInfoList',
              payload: result.svcCont.data,
            });

            yield put({
              type: 'getMemberInfoPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getCreativeTypeListEffect({ payload }, { call }) {
      let result;
      try {
        result = yield call(qryAttrValueByCode, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getChannelListEffect({ payload }, { call }) {
      let result;
      try {
        result = yield call(qryAdviceChannel, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },
  },
  reducers: {
    handleCampaignVisible(state, { payload: campaignVisible }) {
      return Object.assign({}, state, { campaignVisible });
    },

    handleStaticVisible(state, { payload: staticVisible }) {
      return Object.assign({}, state, { staticVisible });
    },

    handleCampaignInfoVisible(state, { payload: campaignInfoVisible }) {
      return Object.assign({}, state, { campaignInfoVisible });
    },

    handleMemberInfoVisible(state, { payload: memberInfoVisible }) {
      return Object.assign({}, state, { memberInfoVisible });
    },

    getCampaignNames(state, { payload: campaignNames }) {
      return Object.assign({}, state, { campaignNames });
    },

    getCampaignIds(state, { payload: currentCampaignIds }) {
      return Object.assign({}, state, { campaignIds: [...currentCampaignIds] });
    },

    getCampaignCodes(state, { payload: campaignCodes }) {
      return Object.assign({}, state, { campaignCodes });
    },

    getBatchList(state, { payload: currentBatchList }) {
      return Object.assign({}, state, { batchList: [...currentBatchList] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    },

    getSelectedBatch(state, { payload: selectedBatch }) {
      return Object.assign({}, state, { selectedBatch });
    },

    // campaignModal
    getCampaignInfoList(state, { payload: currentCampaignInfoList }) {
      return Object.assign({}, state, { campaignInfoList: [...currentCampaignInfoList] });
    },

    getCampaignInfoPageInfo(state, { payload: campaignInfoPageInfo }) {
      return Object.assign({}, state, { campaignInfoPageInfo });
    },

    getMessageInfo(state, { payload: messageInfo }) {
      return Object.assign({}, state, { messageInfo });
    },

    getSubExtendList(state, { payload: currentSubExtendList }) {
      return Object.assign({}, state, { subExtendList: [...currentSubExtendList] });
    },

    getSubExtendPageInfo(state, { payload: subExtendPageInfo }) {
      return Object.assign({}, state, { subExtendPageInfo });
    },

    // memberInfo
    getMemberInfoList(state, { payload: currentMemberInfoList }) {
      return Object.assign({}, state, { memberInfoList: [...currentMemberInfoList] });
    },

    getMemberInfoPageInfo(state, { payload: memberInfoPageInfo }) {
      return Object.assign({}, state, { memberInfoPageInfo });
    },
  },
};

export default models;
