import { message } from 'antd';
import { qryAttrValueByCode } from '@/services/common';

import {
  // qryFieldTypeList,
  qryWorkOrderTypeList,
  qryTemplateElementList,
  addTemplateElement,
  updateTemplateElement,
  getLabelTableCodeField,
  qryIcons,
} from '@/services/TemplateElement/templateElement';

const models = {
  namespace: 'templateElement',
  state: {
    workOrderTypeList: [],
    fieldTypeList: [],
    templateElementList: [],
    pageInfo: {
      total: 0,
      pageNum: 1,
      pageSize: 10,
    },
    // add update view
    action: '',
    elementModalVisible: false,
    currentTemplateElement: {},
    mapTables: [],
  },

  effects: {
    *fetchWorkOrderTypeListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryWorkOrderTypeList, payload);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getWorkOrderTypeList',
            payload: result.svcCont.data,
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },

    // 字段类型或映射表
    *fetchFieldTypeListOrMappingEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryAttrValueByCode, payload);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },

    *fetchTemplateElementListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.templateElement.pageInfo);
        const pageInfo = {
          pageNum,
          pageSize,
        };
        const params = { ...payload, pageInfo };
        const result = yield call(qryTemplateElementList, params);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getTemplateElementList',
            payload: result.svcCont.data,
          });
          const {
            pageNum: serverPageNum,
            pageSize: serverPageSize,
            total,
          } = result.svcCont.pageInfo;
          yield put({
            type: 'getPageInfo',
            payload: {
              pageNum: serverPageNum || 1,
              pageSize: serverPageSize || 1,
              total,
            },
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },

    *addTemplateElementEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(addTemplateElement, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            callback(result.svcCont);
          } else if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error(err);
      }
    },

    // 修改 删除 启动 终止
    *updateTemplateElementEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(updateTemplateElement, payload);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            callback(result.svcCont);
          } else if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error(err);
      }
    },

    // 字段类型或映射表
    *fetchMapFieldEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(getLabelTableCodeField, payload);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },

    // 获取图标列表
    *qryIconsEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryIcons, payload);
        if (result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch (err) {
        message.error(err);
      }
    },
  },

  reducers: {
    getWorkOrderTypeList(state, { payload: currentWorkOrderTypeList }) {
      return Object.assign({}, state, { workOrderTypeList: [...currentWorkOrderTypeList] });
    },

    getFieldTypeList(state, { payload: currentFieldTypeList }) {
      return Object.assign({}, state, { fieldTypeList: [...currentFieldTypeList] });
    },

    getTemplateElementList(state, { payload: currentTemplateElementList }) {
      return Object.assign({}, state, { templateElementList: [...currentTemplateElementList] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    },

    switchModalVisible(state, { payload: elementModalVisible }) {
      return Object.assign({}, state, { elementModalVisible });
    },

    getAction(state, { payload: action }) {
      return Object.assign({}, state, { action });
    },

    getCurrentTemplateElement(state, { payload: currentTemplateElement }) {
      return Object.assign({}, state, { currentTemplateElement });
    },

    getMapTables(state, { payload: currentMapTablesList }) {
      return Object.assign({}, state, { mapTables: [...currentMapTablesList] });
    },
  },
};

export default models;
