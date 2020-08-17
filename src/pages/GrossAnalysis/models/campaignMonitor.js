import { message } from 'antd';
import {
  qryFeedBackDataLog,
  qryChannelOperationList,
  qryMccRulesGroupList,
  getMccFolderList,
  getCampaignList,
  qryFeedBackDataLogDtl,
} from '@/services/campaignMonitor/campaignMonitor';

const models = {
  namespace: 'campaignMonitor',
  state: {
    // 活动监控列表数据
    monitorListData: [],
    // 活动监控列表分页信息
    pageInfo: {
      // 活动监控列表当前页码
      pageNum: 1,
      // 活动监控列表每页显示数据
      pageSize: 10,
      // 活动监控列表总数据数
      total: 0,
    },
    // 是否展示返回数量 Modal
    isShowStatistics: false,
    // 返回数量 Modal 列表数据
    statisticsListData: [],
    // 返回数量 Modal 分页信息
    statisticsPageInfo: {
      pageNum: 1,
      pageSize: 5,
      total: 0,
    },
    // 监控列表搜索值
    monitorListSearchVal: '',
    // 是否展示高级搜索组件
    advancedSearchVisibility: false,
    // 高级筛选值
    advancedSearchData: {},
    // 显示哪个搜索弹窗 Modal：'activity' 'rules' 'operations'
    showSearchModal: false,
    // 运营位搜索 Modal 表格数据
    operationsModal: {
      // 运营位名称的搜索值
      searchVal: '',
      // 后端返回的所有数据
      allData: [],
      // 选中进行搜索的数据
      choosedData: [],
      // allData 分页信息
      allDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      // choosedData 分页信息
      choosedDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
    },
    // 规则组搜索 Modal 表格数据
    rulesModal: {
      // 规则组名称的搜索值
      searchVal: '',
      // 后端返回的所有数据
      allData: [],
      // 选中进行搜索的数据
      choosedData: [],
      // allData 分页信息
      allDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      // choosedData 分页信息
      choosedDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
    },
    // 活动名称搜索 Modal 表格数据
    activityModal: {
      // 活动名称的搜索值
      searchVal: '',
      // 后端返回的所有数据
      allData: [],
      // 选中进行搜索的数据
      choosedData: [],
      // allData 分页信息
      allDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      // choosedData 分页信息
      choosedDataPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
    },
  },
  effects: {
    // 获取商品监控列表数据
    *getMonitorListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryFeedBackDataLog, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getMonitorList',
              payload: result.svcCont,
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
    *getStatisticsListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryFeedBackDataLogDtl, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getStatisticsList',
              payload: result.svcCont,
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

    // 获取运营位列表数据
    *getOperationListEffect({ payload }, { call, put }) {
      let result;
      try {
        result = yield call(qryChannelOperationList, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getOperationListData',
              payload: result.svcCont,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    // 获取规则组列表数据
    *getRulesListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryMccRulesGroupList, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getRulesListData',
              payload: result.svcCont,
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
    // 获取活动目录树
    *getMccFolderList({ payload }, { call }) {
      let result;

      try {
        result = yield call(getMccFolderList, payload);
      } catch (err) {
        message.error('请求失败');
      }

      return result;
    },
    // 获取活动目录树项对应的列表数据
    *getCampaignListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(getCampaignList, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getCampaignList',
              payload: result.svcCont,
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
  },
  reducers: {
    // 初始化 state
    initState() {
      // models.state 一直都是初始 state 值
      return models.state;
    },

    // // 初始化 models 返回数量统计相关数据
    initStatisticsState(state) {
      const {
        state: { statisticsListData, statisticsPageInfo },
      } = models;
      return { ...state, statisticsListData, statisticsPageInfo };
    },

    // 获取活动活动监控列表数据
    getMonitorList(state, { payload: { data, pageInfo } }) {
      return Object.assign({}, state, { monitorListData: data }, { pageInfo });
    },
    // 获取返回数量列表数据
    getStatisticsList(state, { payload: { data, pageInfo } }) {
      return Object.assign(
        {},
        state,
        { statisticsListData: data },
        { statisticsPageInfo: pageInfo },
      );
    },
    // 处理展示隐藏统计信息模态框
    showStatistics(state, { payload: isShowStatistics }) {
      return Object.assign({}, state, { isShowStatistics });
    },
    // 处理高级搜索组件可见性
    handleAdvancedSearchVisibility(state, { payload: advancedSearchVisibility }) {
      return Object.assign({}, state, { advancedSearchVisibility });
    },
    // 保存高级筛选值
    saveAdvancedSearchData(state, { payload: advancedSearchData }) {
      return Object.assign({}, state, { advancedSearchData });
    },
    // 保存监控列表搜索值
    saveMonitorListSearchVal(state, { payload: monitorListSearchVal }) {
      return Object.assign({}, state, { monitorListSearchVal });
    },
    // 处理显示哪个搜索弹窗 Modal：'activity' 'rules' 'operations'
    handleShowSearchModal(state, { payload: showSearchModal }) {
      return Object.assign({}, state, { showSearchModal });
    },
    // 保存运营位 Modal 搜索项数据
    saveOperationChoosedData(state, { payload: choosedData }) {
      const { operationsModal } = state;
      return Object.assign({}, state, { operationsModal: { ...operationsModal, choosedData } });
    },
    // 保存运营位 Modal 表格所有数据
    getOperationListData(state, { payload: operationsModal }) {
      const { data = [], pageInfo = {} } = operationsModal || {};
      return Object.assign({}, state, {
        operationsModal: { ...state.operationsModal, allData: data, allDataPageInfo: pageInfo },
      });
    },
    // 改变运营位搜索值
    changeOperationSearchVal(state, { payload: searchVal }) {
      const { operationsModal } = state;
      return Object.assign({}, state, { operationsModal: { ...operationsModal, searchVal } });
    },
    // 保存规则组 Modal 搜索选中项数据
    saveRulesChoosedData(state, { payload: choosedData }) {
      const { rulesModal } = state;
      return Object.assign({}, state, { rulesModal: { ...rulesModal, choosedData } });
    },
    // 保存规则组 Modal 表格所有数据
    getRulesListData(state, { payload: rulesModal }) {
      const { data = [], pageInfo = {} } = rulesModal || {};
      return Object.assign({}, state, {
        rulesModal: { ...state.rulesModal, allData: data, allDataPageInfo: pageInfo },
      });
    },
    // 改变规则组搜索值
    changeRulesSearchVal(state, { payload: searchVal }) {
      const { rulesModal } = state;
      return Object.assign({}, state, { rulesModal: { ...rulesModal, searchVal } });
    },
    // 保存活动列表 Modal 选中项数据
    saveActivityChoosedData(state, { payload: choosedData }) {
      const { activityModal } = state;
      return Object.assign({}, state, { activityModal: { ...activityModal, choosedData } });
    },
    // 保存活动列表所有数据
    getCampaignList(state, { payload: activityModal }) {
      const { data = [], pageInfo = {} } = activityModal || {};
      return Object.assign({}, state, {
        activityModal: { ...state.activityModal, allData: data, allDataPageInfo: pageInfo },
      });
    },
    // 改变活动列表搜索值
    changeActivitySearchVal(state, { payload: searchVal }) {
      const { activityModal } = state;
      return Object.assign({}, state, { activityModal: { ...activityModal, searchVal } });
    },
    // 改变页码信息
    changePageInfo(state, { payload: { pageNum, pageSize, type } }) {
      const { operationsModal, rulesModal, activityModal } = state;

      switch (type) {
        case 'operationsModal.choosedDataPageInfo':
          return Object.assign({}, state, {
            operationsModal: {
              ...operationsModal,
              choosedDataPageInfo: { ...operationsModal.choosedDataPageInfo, pageNum, pageSize },
            },
          });
        case 'operationsModal.allDataPageInfo':
          return Object.assign({}, state, {
            operationsModal: {
              ...operationsModal,
              allDataPageInfo: { ...operationsModal.allDataPageInfo, pageNum, pageSize },
            },
          });
        case 'rulesModal.choosedDataPageInfo':
          return Object.assign({}, state, {
            rulesModal: {
              ...rulesModal,
              choosedDataPageInfo: { ...rulesModal.choosedDataPageInfo, pageNum, pageSize },
            },
          });
        case 'rulesModal.allDataPageInfo':
          return Object.assign({}, state, {
            rulesModal: {
              ...rulesModal,
              allDataPageInfo: { ...rulesModal.allDataPageInfo, pageNum, pageSize },
            },
          });
        case 'activityModal.choosedDataPageInfo':
          return Object.assign({}, state, {
            activityModal: {
              ...activityModal,
              choosedDataPageInfo: { ...activityModal.choosedDataPageInfo, pageNum, pageSize },
            },
          });
        case 'activityModal.allDataPageInfo':
          return Object.assign({}, state, {
            activityModal: {
              ...activityModal,
              allDataPageInfo: { ...activityModal.allDataPageInfo, pageNum, pageSize },
            },
          });
        default:
          return Object.assign({}, state, {
            operationsModal: {
              ...operationsModal,
              allDataPageInfo: { ...operationsModal.allDataPageInfo, pageNum, pageSize },
              choosedDataPageInfo: { ...operationsModal.choosedDataPageInfo, pageNum, pageSize },
            },
            rulesModal: {
              ...rulesModal,
              allDataPageInfo: { ...rulesModal.allDataPageInfo, pageNum, pageSize },
              choosedDataPageInfo: { ...rulesModal.choosedDataPageInfo, pageNum, pageSize },
            },
            activityModal: {
              ...activityModal,
              allDataPageInfo: { ...activityModal.allDataPageInfo, pageNum, pageSize },
              choosedDataPageInfo: { ...activityModal.choosedDataPageInfo, pageNum, pageSize },
            },
          });
      }
    },
  },
};

export default models;
