import { message } from 'antd';

import {
  qryAttrValueByCode,
} from '@/services/common';

import {
  qryCellsList,
  qryReplyFulFill,
  qryMccReplyOfferReduControl,
  retryFailFulfill
} from '@/services/ResponseMonitor/responseMonitor';
import { fieldToStr } from '../common';

const models = {
  name: 'responseMonitor',
  state: {
    executeStatusList: [],
    executeList: [],
    selectCampaign: {},
    pageInfo: {
      pageNum: 1,
      pageSize: 5
    },
    campaignVisible: false,
    cellVisible: false,
    campaignNames: '',
    campaignIds: [],
    cellsList: [],
    cellIds: [], // 选择的cellId
    selectedCells: [], // 选择的cell
    cellNames: '', // 选择的cellNames
    cellPageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    campaignPageInfo: {
      pageNum: 1,
      pageSize: 5,
      total: 0
    }
  },
  effects: {
    *getExecuteStatusListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryAttrValueByCode, payload);
        if(result && result.topCont) {
          if(result.topCont.resultCode === 0) {
            yield put({
              type: 'getExecuteStatusList',
              payload: result.svcCont.data
            });
          }
          if(result.topCont.resultCode === -1) {
            message.error(result.topCont.remark)
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getCellsListEffect(_, { call, put, select }) {
      try {
        const pageInfo = yield select(state => state.responseMonitor.cellPageInfo);
        const result = yield call(qryCellsList, pageInfo);
        if(result && result.topCont) {
          if(result.topCont.resultCode === 0) {
            yield put({
              type: 'getCellsList',
              payload: result.svcCont.data
            });
          }
          if(result.topCont.resultCode === -1) {
            message.error(result.topCont.remark)
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getExecuteListEffect({ payload }, { call, put, select }) {
      try {
        const pageInfo = yield select(state => state.responseMonitor.pageInfo);
        const cellIds = yield select(state => state.responseMonitor.cellIds);
        const cellNames = yield select(state => state.responseMonitor.cellNames);
        const campaignIds = yield select(state => state.responseMonitor.campaignIds);
        const campaignNames = yield select(state => state.responseMonitor.campaignNames);
        const params = {
          cellIds,
          cellNames,
          campaignIds,
          campaignNames,
          pageInfo,
          ...payload
        }
        const result = yield call(qryReplyFulFill, params);
        if(result && result.topCont) {
          if(result.topCont.resultCode === 0) {
            yield put({
              type: 'getExecuteList',
              payload: result.svcCont.data
            });
  
            yield put({
              type: 'getPageInfo',
              payload: result.svcCont.pageInfo
            });
          }
          if(result.topCont.resultCode === -1) {
            message.error(result.topCont.remark)
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *qryMccReplyOfferReduControl({ payload }, { call }) {
      let result;
      try {
        result = yield call(qryMccReplyOfferReduControl, payload);
      } catch(err) {
        message.error('请求失败')
      }

      return result;
    },

    *retryFailFulfill({ payload }, { call }) {
      let result;
      try {
        result = yield call(retryFailFulfill, payload);
      } catch(err) {
        message.error('请求失败')
      }

      return result;
    },
  },
  reducers: {
    getExecuteStatusList(state, { payload: currentExecuteStatusList }) {
      return Object.assign({}, state, { executeStatusList: [ ...currentExecuteStatusList ] });
    },
    
    handleCampaignVisible(state, { payload: campaignVisible }) {
      return Object.assign({}, state, { campaignVisible });
    },

    handleCellVisible(state, { payload: cellVisible }) {
      return Object.assign({}, state, { cellVisible });
    },

    getCellsList(state, { payload: currentCellsList }) {
      return Object.assign({}, state, { cellsList: [ ...currentCellsList ] });
    },

    getCellPageInfo(state, { payload: cellPageInfo }) {
      return Object.assign({}, state, { cellPageInfo });
    },

    getSelectedCells(state, { payload: selectedCells }) {
      const splitChar = ',';
      const cellIds = [];
      selectedCells.forEach(cell => {
        cellIds.push(cell.cellid);
      });
      const cellNames = fieldToStr(selectedCells, 'cellName', splitChar);
      return Object.assign({}, state, {selectedCells: [...selectedCells], cellIds: [...cellIds], cellNames})
    },

    getCampaignNames(state, { payload: campaignNames }) {
      return Object.assign({}, state, {  campaignNames })
    },

    getCampaignIds(state, { payload: currentCampaignIds }) {
      return Object.assign({}, state, { campaignIds: [ ...currentCampaignIds ] });
    },

    getExecuteList(state, { payload: currentExecuteList}) {
      return Object.assign({}, state, { executeList: [ ...currentExecuteList ] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    },
  }
}

export default models;