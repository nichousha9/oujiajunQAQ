import { qryAttrValueByCode } from '@/services/common';

const Common = {
  namespace: 'common',
  state: {
    attrSpecCodeList: {
      CAMPAIGN_BUSI_TYPE: '', // 业务类型
      CAMPAIGN_PRIORITY_TYPE: '', // 优先级
      SELECT_TYPE: '', // 选择类型
      TEMPLATE_INFO_TYPE: '', // 创意模板类型
      IS_ENGINE: '', // 是否为创意模板
    }, // 数字字典，key为attrSpecCode
  },
  effects: {
    *qryAttrValueByCode({ payload }, { call, put }) {
      const res = yield call(qryAttrValueByCode, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const {
          svcCont: { data },
        } = res;
        yield put({
          type: 'changeAttrSpecCodeList',
          payload: {
            [payload.attrSpecCode]: data,
          },
        });
      }
    },
  },
  reducers: {
    changeAttrSpecCodeList(state, { payload }) {
      return {
        ...state,
        attrSpecCodeList: { ...state.attrSpecCodeList, ...payload },
      };
    },
  },
};
export default Common;
