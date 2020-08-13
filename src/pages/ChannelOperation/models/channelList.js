import { formatMessage } from 'umi-plugin-react/locale';
import { message } from 'antd';
import {
  qryChannelByCondition,
  qryChannelDetailsById,
  addChannel,
  updateChannel,
  deleteChannel,
} from '@/services/channelOperation/channelList';

const models = {
  namespace: 'channelList',
  state: {
    // 渠道列表数据
    dataSource: [],
    // 是否显示高级筛选输入框
    showAdvancedFilterInput: false,
    // 列表每页条数
    pageSize: 10,
    // 总数据数量
    dataTotal: 0,
    // 当前页数
    currentPage: 1,
    // 当前展示运营位列表对应的渠道项 ID
    currentShowOperationOfChannel: null,
    // 渠道项详情数据
    channelItemDetails: {},
    // 渠道图标
    channelIcon: ['icon-SMS', 'icon-IVR', 'icon-Email', 'icon-APP', 'icontv', 'icon-Ussd'],
    // 渠道名称搜索框
    searchInputOfName: '',
    // 渠道编码搜索框内容
    searchInputOfCode: '',
    // 渠道编码搜索内容（用于搜索获取列表数据时用到的值）
    searchOfCode: '',
    // 表单显示形式 'readonly' 'edit' 'add' fasle（不显示表单）
    formType: false,
    // 列表状态项代码转文本描述
    stateToInfo: {
      '0': {
        des: formatMessage(
          {
            id: 'channelOperation.channel.awaitEffect',
          },
          '待生效',
        ),
        icon: 'default',
      },
      '1': {
        des: formatMessage(
          {
            id: 'channelOperation.channel.effected',
          },
          '有效',
        ),
        icon: 'success',
      },
      '2': {
        des: formatMessage(
          {
            id: 'channelOperation.channel.invalid',
          },
          '无效',
        ),
        icon: 'error',
      },
    },
  },
  effects: {
    // 处理获取渠道列表数据
    *getDataSourceEffect({ payload }, { call, put }) {
      const result = yield call(qryChannelByCondition, payload);
      if (result && result.topCont && result.topCont.resultCode === 0) {
        yield put({
          type: 'getDataSource',
          payload: result,
        });
      }
    },
    // 获取渠道项详情
    *getChannelItemDetailsEffect({ payload }, { call, put }) {
      const result = yield call(qryChannelDetailsById, payload);
      if (result && result.topCont && result.topCont.resultCode === 0) {
        yield put({
          type: 'getChannelItemDetails',
          payload: result.svcCont,
        });
      }
    },

    // 删除渠道项
    *handleDeleteChannelEffect({ payload }, { call }) {
      const result = yield call(deleteChannel, payload);
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          message.success('删除成功');
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },
    // 提交表单（新增渠道项）
    *addChannelEffect({ payload }, { call, put }) {
      const result = yield call(addChannel, payload);
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          yield put({
            type: 'handleFormShow',
            payload: false,
          });
          message.success('操作成功');
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },
    // 提交表单（编辑渠道项）
    *editChannelEffect({ payload }, { call, put }) {
      const result = yield call(updateChannel, payload);

      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          yield put({
            type: 'handleFormShow',
            payload: false,
          });
          message.success('操作成功');
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },
  },
  reducers: {
    // 初始化 state
    initChannelState() {
      // models.state 一直都是初始 state 值
      return models.state;
    },
    // 获取列表数据
    getDataSource(state, { payload }) {
      return Object.assign({}, state, {
        dataSource: payload.svcCont.data,
        dataTotal: payload.svcCont.pageInfo.total,
        currentPage: payload.svcCont.pageInfo.pageNum,
      });
    },

    // 处理高级筛选输入框显示与隐藏
    handleAdvanceFilterInput(state) {
      return Object.assign({}, state, { showAdvancedFilterInput: !state.showAdvancedFilterInput });
    },

    // 改变当前被展示的运营位列表对应的渠道项 ID
    changeCurrentShowOperationOfChannel(state, { payload: currentShowOperationOfChannel }) {
      return Object.assign({}, state, { currentShowOperationOfChannel });
    },

    // 获取渠道项详情
    getChannelItemDetails(state, { payload: channelItemDetails }) {
      return Object.assign({}, state, { channelItemDetails });
    },

    // 处理是否显示表单
    handleFormShow(state, { payload: formType }) {
      let { channelItemDetails } = state;
      // 隐藏表单时，把表单数据清空
      if (!formType) {
        channelItemDetails = {};
      }
      return Object.assign({}, state, { channelItemDetails, formType });
    },

    // 改变每页显示条数 pageSize
    changePageSize(state, { payload: pageSize }) {
      return Object.assign({}, state, { pageSize });
    },

    // 改变 “渠道名称输入框的值”
    changeSearchInputOfName(state, { payload: searchInputOfName }) {
      return Object.assign({}, state, { searchInputOfName });
    },

    // 改变“渠道编码输入框的值”
    changeSearchInputOfCode(state, { payload: searchInputOfCode }) {
      return Object.assign({}, state, { searchInputOfCode });
    },

    // 改变  编码搜索  值
    changeSearchOfCode(state, { payload: searchOfCode }) {
      return Object.assign({}, state, { searchOfCode });
    },
  },
};

export default models;
