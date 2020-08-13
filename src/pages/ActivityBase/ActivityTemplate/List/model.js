import { message } from 'antd';
import { qryOrderModelList, delOrderModel, startOrderModel } from '@/services/activityTemplate';

const Model = {
  namespace: 'ActivityTemplateList',
  state: {},
  effects: {
    *qryContactList({ payload, success }, { call }) {
      const res = yield call(qryOrderModelList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *delteModel({ payload, success }, { call }) {
      const res = yield call(delOrderModel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        message.success('成功');
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *startModel({ payload, success }, { call }) {
      const res = yield call(startOrderModel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        message.success('成功');
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
  },
  reducers: {},
};
export default Model;
