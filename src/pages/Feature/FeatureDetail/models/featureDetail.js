import { message } from 'antd';
import { 
  addFeatureView,
  updateFeatureView,
  queryFeatureViewInfoById
} from '@/services/feature';

export default {
  namespace: 'featureDetail',
  state: {

  },
  effects: {
    *addFeatureView({ payload, success }, { call }) {
      const res = yield call(addFeatureView, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *updateFeatureView({ payload, success }, { call }) {
      const res = yield call(updateFeatureView, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *queryFeatureViewInfoById({ payload, success }, { call }) {
      const res = yield call(queryFeatureViewInfoById, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark || '获取详情数据失败');
      }
    },
  },

}