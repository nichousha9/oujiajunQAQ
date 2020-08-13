import { message } from 'antd';
import { 
  qryFeatureViewList,
  delFeatureView,
  effictiveFeatureView
} from '@/services/feature';

export default {
  namespace: 'featureList',
  state: {

  },
  effects: {
    *qryFeatureViewList({ payload, success }, { call }) {
      const res = yield call(qryFeatureViewList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *delFeatureView({ payload, success }, { call }) {
      const res = yield call(delFeatureView, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *effictiveFeatureView({ payload, success }, { call }) {
      const res = yield call(effictiveFeatureView, payload);
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

}