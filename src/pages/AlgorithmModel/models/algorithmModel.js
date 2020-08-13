import { message } from 'antd';
import { qryAttrValueByCode } from '@/services/common';
import {
  qryHasFold,
  qryAlgorithmFoldList,
  addAlgorithmFold,
  updateAlgorithmFold,
  deleteAlgorithmFold,
  judgeCanCatalogDelete,
  qryAlgorithmModuleList,
  addAlgorithmModule,
  updateAlgorithmModule,
  deleteAlgorithmModule,
  effectiveAlgorithmModule,
  qryAlgorithmById,
} from '@/services/AlgorithmModel/algorithmModel';

import {
  qryFeatureViewList,
} from '@/services/feature';

const models = {
  namespace: 'algorithmModel',
  state: {
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    currentCatalogBasicInfo: {}, // 保存目录基本信息 key, title
    algorithmTypeList: [], // 算法类型列表
    engineCode: '', // 判断当前引擎是alibaba还是iwhale
  },
  effects: {
    // 检查是否有根目录
    *qryHasFoldEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryHasFold, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 算法目录
    *qryAlgorithmFoldListEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryAlgorithmFoldList, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *addAlgorithmFoldEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(addAlgorithmFold, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *updateAlgorithmFoldEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(updateAlgorithmFold, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *deleteAlgorithmFoldEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(deleteAlgorithmFold, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },
    
    *judgeCanCatalogDeleteEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(judgeCanCatalogDelete, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 算法模型
    *qryAlgorithmTypeListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryAttrValueByCode, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getAlgorithmTypeList',
            payload: result.svcCont.data,
          });
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // statusList, optimizeTargetList engineCode
    *qryStaticsListEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryAttrValueByCode, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
      
          if(typeof callback === 'function') {
            callback(result.svcCont);
          }
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 算法模型列表
    *qryAlgorithmModuleListEffect({ payload, callback }, { call, select, put }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.algorithmModel.pageInfo);
        const currentCatalogBasicInfo = yield select(state => state.algorithmModel.currentCatalogBasicInfo);
        const pageInfo = {
          pageNum,
          pageSize
        };
        const fold = currentCatalogBasicInfo.key;
        const params = { ...payload, pageInfo, fold };
        const result = yield call(qryAlgorithmModuleList, params);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          const { pageNum: serverPageNum, pageSize: serverPageSize, total } = result.svcCont.pageInfo;
          yield put({
            type: 'getPageInfo',
            payload: {
              pageNum: serverPageNum || 1,
              pageSize: serverPageSize || 1,
              total
            }
          });
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 算法增改删，生效
    *addAlgorithmModuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(addAlgorithmModule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *updateAlgorithmModuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(updateAlgorithmModule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *deleteAlgorithmModuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(deleteAlgorithmModule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *effectiveAlgorithmModuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(effectiveAlgorithmModule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *qryAlgorithmByIdEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryAlgorithmById, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },
    
    // 特征视图
    *qrySchemaListEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryFeatureViewList, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    }
  },
  reducers: {
    getCurrentCatalogBasicInfo(state, { payload: currentCatalogBasicInfo }) {
      return Object.assign({}, state, { currentCatalogBasicInfo });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    },

    getAlgorithmTypeList(state, { payload: algorithmTypeList }) {
      return Object.assign({}, state, { algorithmTypeList });
    },

    getEngineCode(state, { payload: engineCode }) {
      return Object.assign({}, state, { engineCode })
    },
  }
}

export default models;
