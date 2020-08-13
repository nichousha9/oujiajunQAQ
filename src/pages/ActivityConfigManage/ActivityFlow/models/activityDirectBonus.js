import { message } from 'antd';

import {
  qryProcess,
  addProcess,
  modProcess,
  qryMccListenerInjection,
} from '@/services/ActivityConfigManage/activityDirectBonus';

const models = {
  namespace: 'activityDirectBonus',
  state: {
  },
  effects: {

    *qryProcess({ payload, callback }, { call }) {
      const result = yield call(qryProcess, payload);
      if(result && result.topCont) {
        if(parseInt(result.topCont.resultCode, 10) === 0) {
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
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

    *qryMccListenerInjection({ payload, callback }, { call }) {
      const result = yield call(qryMccListenerInjection, payload);
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