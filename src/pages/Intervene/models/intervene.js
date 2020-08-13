import { message } from 'antd';
import {
  qryAttrValueByCode,
} from '@/services/common';

import {
  qryInterveneList,
  addIntervene,
  delIntervene,
  effectiveIntervene,
  updateIntervene,
  qryInterveneRule,
  addInterveneRule,
  delInterveneRule,
  updateInterveneRule,
} from '@/services/Intervene/intervene';
const models = {
  namespace: 'intervene',
  state: {
  },

  effects: {
    // 静态数据
    *qryStatusListEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryAttrValueByCode, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 干预规则组

    *qryInterveneListEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryInterveneList, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *addInterveneEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(addIntervene, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *delInterveneEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(delIntervene, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *effectiveInterveneEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(effectiveIntervene, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *updateInterveneEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(updateIntervene, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    // 干预规则列表
    *qryInterveneRuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(qryInterveneRule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *addInterveneRuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(addInterveneRule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *delInterveneRuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(delInterveneRule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },

    *updateInterveneRuleEffect({ payload, callback }, { call }) {
      try {
        const result = yield call(updateInterveneRule, payload);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          callback(result.svcCont);
        } else {
          message.error(result && result.topCont && result.topCont.remark);
        }
      } catch(err) {
        message.error(err);
      }
    },
  }
}

export default models;
