import {
  getMccLabelRelsList,
  getMccLabelValueList,
  addMccLabelRelsInfo,
  updateMccLabelRelsInfo,
} from '@/services/labelConfigManage/labelConfig';
import { getLabelInfoList } from '@/services/labelConfigManage/labelManage';

export default {
  namespace: 'labelConfig',
  state: {
    labelRelsListData: {}, // 标签关联度列表的数据和分页信息
    labelListData: {}, // 需要选择的标签列表
  },
  effects: {
    // 获取关联度列表
    *getMccLabelRelsList({ payload }, { call, put }) {
      const response = yield call(getMccLabelRelsList, payload);
      yield put({
        type: 'getMccLabelRelsListReducer',
        payload: response.svcCont,
      });
    },

    // 获取标签列表
    *getLabelInfoList({ payload }, { call, put }) {
      const response = yield call(getLabelInfoList, payload);
      yield put({
        type: 'getLabelInfoListReducer',
        payload: response.svcCont,
      });
    },

    // 获取标签值列表
    *getMccLabelValueList({ payload }, { call }) {
      const response = yield call(getMccLabelValueList, payload);
      return response;
    },

    // 新增标签关联度
    *addMccLabelRelsInfo({ payload }, { call }) {
      const response = yield call(addMccLabelRelsInfo, payload);
      return response;
    },

    // 新增标签关联度
    *updateMccLabelRelsInfo({ payload }, { call }) {
      const response = yield call(updateMccLabelRelsInfo, payload);
      return response;
    },
  },
  reducers: {
    // 保存标签关联度列表的数据和分页信息
    getMccLabelRelsListReducer(state, { payload: labelRelsListData }) {
      return {
        ...state,
        labelRelsListData,
      };
    },

    // 保存标签列表的数据
    getLabelInfoListReducer(state, { payload: labelListData }) {
      return {
        ...state,
        labelListData,
      };
    },

    // 情况标签列表的数据
    resetLabelListData(state) {
      return {
        ...state,
        labelListData: {},
      };
    },
  },
};
