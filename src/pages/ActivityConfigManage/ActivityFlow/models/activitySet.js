import { message } from 'antd';
import {
  qryAttrValueByCode,
} from '@/services/common';

import {
  qryProcessCellNameList,
  qryTarGrpLebalRels,
  qryTarGrp,
  addProcess,
  modProcess,
} from '@/services/ActivityConfigManage/activitySet';

const models = {
  namespace: 'activitySet',
  state: {},
  effects: {
    *qryProcessCellNameList({ payload, callback }, { call }) {
      const result = yield call(qryProcessCellNameList, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

    *qryTarGrpLabelInfo({ payload, callback }, { call }) {
      const result = yield call(qryTarGrpLebalRels, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

    *getSetTypeList({ payload, callback }, { call }) {
      const result = yield call(qryAttrValueByCode, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

    *qryTarGrp({ payload, callback }, { call }) {
      const result = yield call(qryTarGrp, payload);
      if(result && result.mccTarGrp) {
        callback(result);
      }
      // TODO: 请求错误处理
    },
    
    *addProcess({ payload, callback }, { call }) {
      const result = yield call(addProcess, payload);
      if(result && result.topCont) {
        if(parseInt(result.topCont.resultCode, 10) === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

    *modProcess({ payload, callback }, { call }) {
      const result = yield call(modProcess, payload);
      if(result && result.topCont) {
        if(parseInt(result.topCont.resultCode, 10) === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },
    
  },
  reducers: {}
}

export default models;