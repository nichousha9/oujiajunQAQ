import { formatMessage } from 'umi-plugin-react/locale';
import { message } from 'antd';
import {
  qryChannelOperationById,
  addChannelOperation,
  qryChannelOperationDetail,
  updateChannelOperation,
  deleteOperationBit,
} from '@/services/channelOperation/operationBitList';

const models = {
  namespace: 'operationBitList',
  state: {
    // 运营位列表数据
    dataSource: [],
    // 列表每页条数
    pageSize: 5,
    // 总数据数量
    dataTotal: 0,
    // 当前页码
    currentPage: 1,
    // 是否显示运营项表单
    showForm: false,
    // 运营位项详情
    operationItemDetail: {},
    // 运营位列表对应的渠道信息
    channelItem: {},
    // 表单展示形式 'add' 'edit' 'readonly'
    formType: '',
    // 搜索值
    searchName: '',
    searchCode: '',
    // 编码搜索框的值
    searchInputCode: '',
    // 列表状态项代码转文本描述
    stateToInfo: {
      '0': {
        des: formatMessage(
          {
            id: 'channelOperation.operation.awaitEffect',
          },
          '待生效',
        ),
        icon: 'default',
      },
      '1': {
        des: formatMessage(
          {
            id: 'channelOperation.operation.effected',
          },
          '有效',
        ),
        icon: 'success',
      },
      '2': {
        des: formatMessage(
          {
            id: 'channelOperation.operation.invalid',
          },
          '无效',
        ),
        icon: 'error',
      },
    },
  },
  effects: {
    // 根据渠道列表 ID 获取运营位列表数据
    *getListDataByChannelIdEffect({ payload }, { call, put }) {
      const result = yield call(qryChannelOperationById, payload);
      if (result && result.topCont && result.topCont.resultCode === 0) {
        yield put({
          type: 'getDataSource',
          payload: result.svcCont,
        });
      }
    },

    // 获取运营位详情
    *getOperationBitDetailsByIdEffect({ payload }, { call, put }) {
      const result = yield call(qryChannelOperationDetail, payload);
      if (result && result.topCont && result.topCont.resultCode === 0) {
        yield put({
          type: 'handleOperationBitDetails',
          payload: result.svcCont.data,
        });
      }
    },

    // 删除运营位
    *deleteOperationBitEffect({ payload }, { call }) {
      const result = yield call(deleteOperationBit, payload);

      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          message.success('删除成功');
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },
    // 保存（修改、新增）运营位
    *saveChannelOperationEffect(
      {
        payload: { data, method },
      },
      { call, put },
    ) {
      let result;
      if (method === 'add') {
        result = yield call(addChannelOperation, data);
      } else if (method === 'edit') {
        result = yield call(updateChannelOperation, data);
      }
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          yield put({
            type: 'handleFormHidden',
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
    initOperationState() {
      // models.state 一直都是初始 state 值
      return models.state;
    },

    getDataSource(state, { payload }) {
      return Object.assign({}, state, {
        dataSource: payload.data,
        dataTotal: payload.pageInfo.total,
        currentPage: payload.pageInfo.pageNum,
      });
    },

    // 显示表单
    handleShowForm(state, { payload: formType }) {
      return Object.assign({}, state, { showForm: true, formType });
    },

    // 隐藏表单
    handleFormHidden(state) {
      return Object.assign({}, state, { showForm: false });
    },

    // 运营位的对应的渠道编码
    handleChannelItemOfOperation(state, { payload: channelItem }) {
      return Object.assign({}, state, { channelItem });
    },

    // 保存运营位项详情
    handleOperationBitDetails(state, { payload: operationItemDetail }) {
      return Object.assign({}, state, { operationItemDetail });
    },

    // 保存 “运营位编码” 搜索框的值
    saveSearchInputCode(state, { payload: searchInputCode }) {
      return Object.assign({}, state, { searchInputCode });
    },

    // 保存搜索值
    saveSearchName(state, { payload: searchName }) {
      return Object.assign({}, state, { searchName });
    },
    saveSearchCode(state, { payload: searchCode }) {
      return Object.assign({}, state, { searchCode });
    },

    // 改变当前页
    // changeCurrentPage(state, { payload: currentPage }) {
    //   return Object.assign({}, state, { currentPage });
    // },

    // 更改 pageSize
    changePageSize(state, { payload: pageSize }) {
      return Object.assign({}, state, { pageSize });
    },
  },
};

export default models;
