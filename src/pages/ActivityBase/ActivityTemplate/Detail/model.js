import { message } from 'antd';
import { 
  qryCamType
} from '@/services/ActivityConfigManage/ActivityFlow';
import {
  addOrderModel,
  modifyOrderModel,
  qryMccModelColRel,
  qryColsGroupByCamType
} from '@/services/activityTemplate';

const Model = {
  namespace: 'activityTemplateDetail',
  state: {
  },
  effects: {
    *qryCamType({ payload, success }, { call }) {
      const res = yield call(qryCamType, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *addOrderModel({ payload, success }, { call }) {
      const res = yield call(addOrderModel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
        message.info('新增成功');
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *modifyOrderModel({ payload, success }, { call }) {
      const res = yield call(modifyOrderModel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
        message.info('保存成功');
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryMccModelColRel({ payload, success }, { call }) {
      const res = yield call(qryMccModelColRel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryColsGroupByCamType({ payload, success }, { call }) {
      const res = yield call(qryColsGroupByCamType, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
